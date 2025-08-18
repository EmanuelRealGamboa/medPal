from rest_framework import serializers
from .models import VaccineType, VaccineRecord, VaccineAlert
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class VaccineTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VaccineType
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class VaccineRecordSerializer(serializers.ModelSerializer):
    vaccine_type_name = serializers.CharField(source='vaccine_type.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    is_overdue = serializers.ReadOnlyField()
    days_until_due = serializers.ReadOnlyField()
    next_dose_date = serializers.ReadOnlyField()
    
    class Meta:
        model = VaccineRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'created_by', 'user')  # user ahora es read-only

    def validate(self, data):
        # Obtener vaccine_type y dose_number desde data o instancia existente
        vaccine_type = data.get('vaccine_type') or getattr(self.instance, 'vaccine_type', None)
        dose_number = data.get('dose_number') or getattr(self.instance, 'dose_number', None)

        if vaccine_type and dose_number:
            # Validar dosis máxima
            if dose_number > vaccine_type.doses_required:
                raise serializers.ValidationError(
                    f"La dosis {dose_number} excede las {vaccine_type.doses_required} dosis requeridas para {vaccine_type.name}"
                )
            
            # Validar duplicados
            user = self.context['request'].user
            if VaccineRecord.objects.filter(
                user=user, 
                vaccine_type=vaccine_type, 
                dose_number=dose_number
            ).exclude(pk=self.instance.pk if self.instance else None).exists():
                raise serializers.ValidationError(
                    f"Ya existe un registro para la dosis {dose_number} de {vaccine_type.name}"
                )

        # Validar fechas
        scheduled_date = data.get('scheduled_date') or getattr(self.instance, 'scheduled_date', None)
        applied_date = data.get('applied_date') or getattr(self.instance, 'applied_date', None)
        
        if applied_date and scheduled_date and applied_date < scheduled_date:
            raise serializers.ValidationError(
                "La fecha de aplicación no puede ser anterior a la fecha programada"
            )
        
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user
            validated_data['created_by'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request and request.user:
            validated_data['user'] = request.user  # siempre usamos el usuario autenticado
        return super().update(instance, validated_data)


class VaccineRecordCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para crear registros de vacunas"""
    
    class Meta:
        model = VaccineRecord
        fields = [
            'vaccine_type', 'dose_number', 'scheduled_date', 
            'applied_date', 'healthcare_provider', 'doctor_name', 
            'batch_number', 'reaction', 'reaction_notes', 'notes'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        validated_data['created_by'] = request.user
        return super().create(validated_data)

class VaccineAlertSerializer(serializers.ModelSerializer):
    vaccine_name = serializers.CharField(source='vaccine_record.vaccine_type.name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = VaccineAlert
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'sent_at')

class VaccineScheduleSerializer(serializers.Serializer):
    """Serializer para generar cronograma de vacunas"""
    user_id = serializers.IntegerField()
    birth_date = serializers.DateField()
    include_applied = serializers.BooleanField(default=True)
    
    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado")
        return value

class VaccinationCardSerializer(serializers.Serializer):
    """Serializer para la cartilla de vacunación completa"""
    user = serializers.SerializerMethodField()
    total_vaccines = serializers.SerializerMethodField()
    applied_vaccines = serializers.SerializerMethodField()
    pending_vaccines = serializers.SerializerMethodField()
    overdue_vaccines = serializers.SerializerMethodField()
    upcoming_vaccines = serializers.SerializerMethodField()
    vaccine_records = VaccineRecordSerializer(many=True, read_only=True)
    alerts = VaccineAlertSerializer(many=True, read_only=True)
    
    def get_user(self, obj):
        return {
            'id': obj.id,
            'name': obj.name,
            'email': obj.email,
            'phone': obj.phone
        }
    
    def get_total_vaccines(self, obj):
        return obj.vaccine_records.count()
    
    def get_applied_vaccines(self, obj):
        return obj.vaccine_records.filter(status='applied').count()
    
    def get_pending_vaccines(self, obj):
        return obj.vaccine_records.filter(status='scheduled').count()
    
    def get_overdue_vaccines(self, obj):
        return obj.vaccine_records.filter(status='overdue').count()
    
    def get_upcoming_vaccines(self, obj):
        upcoming_date = timezone.now().date() + timedelta(days=30)
        return obj.vaccine_records.filter(
            status='scheduled',
            scheduled_date__lte=upcoming_date
        ).count()