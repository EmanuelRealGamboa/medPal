from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, Count
from datetime import timedelta, date
from .models import VaccineType, VaccineRecord, VaccineAlert
from .serializers import (
    VaccineTypeSerializer, VaccineRecordSerializer, VaccineRecordCreateSerializer,
    VaccineAlertSerializer, VaccinationCardSerializer, VaccineScheduleSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class VaccineTypeViewSet(viewsets.ModelViewSet):
    """CRUD para tipos de vacunas"""
    queryset = VaccineType.objects.filter(is_active=True)
    serializer_class = VaccineTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(manufacturer__icontains=search)
            )
        return queryset

class VaccineRecordViewSet(viewsets.ModelViewSet):
    """CRUD para registros de vacunas"""
    serializer_class = VaccineRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Los usuarios solo ven sus propios registros
        return VaccineRecord.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return VaccineRecordCreateSerializer
        return VaccineRecordSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_applied(self, request, pk=None):
        """Marcar una vacuna como aplicada"""
        record = self.get_object()
        applied_date = request.data.get('applied_date', timezone.now().date())
        
        record.applied_date = applied_date
        record.status = 'applied'
        record.healthcare_provider = request.data.get('healthcare_provider', '')
        record.doctor_name = request.data.get('doctor_name', '')
        record.batch_number = request.data.get('batch_number', '')
        record.reaction = request.data.get('reaction', 'none')
        record.reaction_notes = request.data.get('reaction_notes', '')
        record.notes = request.data.get('notes', '')
        record.save()
        
        # Crear siguiente dosis si es necesaria
        self._create_next_dose_if_needed(record)
        
        serializer = self.get_serializer(record)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Obtener vacunas próximas (próximos 30 días)"""
        upcoming_date = timezone.now().date() + timedelta(days=30)
        upcoming_vaccines = self.get_queryset().filter(
            status='scheduled',
            scheduled_date__lte=upcoming_date
        ).order_by('scheduled_date')
        
        serializer = self.get_serializer(upcoming_vaccines, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Obtener vacunas vencidas"""
        overdue_vaccines = self.get_queryset().filter(
            status='scheduled',
            scheduled_date__lt=timezone.now().date()
        ).order_by('scheduled_date')
        
        # Actualizar estado a vencido
        overdue_vaccines.update(status='overdue')
        
        serializer = self.get_serializer(overdue_vaccines, many=True)
        return Response(serializer.data)
    
    def _create_next_dose_if_needed(self, record):
        """Crear automáticamente la siguiente dosis si es necesaria"""
        if (record.dose_number < record.vaccine_type.doses_required and
            record.vaccine_type.interval_days):
            
            next_date = record.applied_date + timedelta(days=record.vaccine_type.interval_days)
            
            # Verificar que no exista ya
            if not VaccineRecord.objects.filter(
                user=record.user,
                vaccine_type=record.vaccine_type,
                dose_number=record.dose_number + 1
            ).exists():
                
                VaccineRecord.objects.create(
                    user=record.user,
                    vaccine_type=record.vaccine_type,
                    dose_number=record.dose_number + 1,
                    scheduled_date=next_date,
                    status='scheduled',
                    created_by=record.created_by
                )

class VaccineAlertViewSet(viewsets.ModelViewSet):
    """CRUD para alertas de vacunas"""
    serializer_class = VaccineAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return VaccineAlert.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marcar alerta como leída"""
        alert = self.get_object()
        alert.mark_as_read()
        serializer = self.get_serializer(alert)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Obtener alertas no leídas"""
        unread_alerts = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_alerts, many=True)
        return Response(serializer.data)

class VaccinationCardView(APIView):
    """Vista para obtener la cartilla de vacunación completa"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Obtener registros de vacunas con prefetch para optimizar
        user.vaccine_records = user.vaccine_records.select_related('vaccine_type').all()
        user.alerts = user.vaccine_alerts.filter(is_read=False).select_related('vaccine_record__vaccine_type')[:10]
        
        serializer = VaccinationCardSerializer(user)
        return Response(serializer.data)

class VaccineScheduleView(APIView):
    """Vista para generar cronograma de vacunas recomendado"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = VaccineScheduleSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            birth_date = serializer.validated_data['birth_date']
            include_applied = serializer.validated_data['include_applied']
            
            user = get_object_or_404(User, id=user_id)
            
            # Verificar que el usuario puede acceder a esta información
            if user != request.user:
                return Response(
                    {'error': 'No tienes permiso para acceder a esta información'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            schedule = self._generate_vaccine_schedule(user, birth_date, include_applied)
            return Response(schedule)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _generate_vaccine_schedule(self, user, birth_date, include_applied):
        """Generar cronograma de vacunas basado en edad"""
        today = timezone.now().date()
        age_months = (today.year - birth_date.year) * 12 + today.month - birth_date.month
        
        # Obtener vacunas recomendadas para la edad
        recommended_vaccines = VaccineType.objects.filter(
            is_active=True,
            age_min_months__lte=age_months,
            age_max_months__gte=age_months
        )
        
        schedule = []
        
        for vaccine in recommended_vaccines:
            # Verificar registros existentes
            existing_records = VaccineRecord.objects.filter(
                user=user,
                vaccine_type=vaccine
            ).order_by('dose_number')
            
            applied_doses = existing_records.filter(status='applied').count()
            
            for dose in range(1, vaccine.doses_required + 1):
                existing_record = existing_records.filter(dose_number=dose).first()
                
                if existing_record:
                    if include_applied or existing_record.status != 'applied':
                        schedule.append({
                            'vaccine_type': VaccineTypeSerializer(vaccine).data,
                            'dose_number': dose,
                            'status': existing_record.status,
                            'scheduled_date': existing_record.scheduled_date,
                            'applied_date': existing_record.applied_date,
                            'record_id': existing_record.id
                        })
                else:
                    # Calcular fecha recomendada
                    if dose == 1:
                        recommended_date = birth_date + timedelta(days=vaccine.age_min_months * 30)
                    else:
                        prev_dose = existing_records.filter(dose_number=dose-1).first()
                        if prev_dose and prev_dose.applied_date:
                            recommended_date = prev_dose.applied_date + timedelta(days=vaccine.interval_days or 30)
                        else:
                            recommended_date = today + timedelta(days=30)
                    
                    schedule.append({
                        'vaccine_type': VaccineTypeSerializer(vaccine).data,
                        'dose_number': dose,
                        'status': 'recommended',
                        'recommended_date': recommended_date,
                        'record_id': None
                    })
        
        return {
            'user_id': user.id,
            'birth_date': birth_date,
            'age_months': age_months,
            'schedule': sorted(schedule, key=lambda x: x.get('scheduled_date') or x.get('recommended_date') or today)
        }

class VaccineStatsView(APIView):
    """Vista para estadísticas de vacunación"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Estadísticas básicas
        total_records = VaccineRecord.objects.filter(user=user).count()
        applied_count = VaccineRecord.objects.filter(user=user, status='applied').count()
        pending_count = VaccineRecord.objects.filter(user=user, status='scheduled').count()
        overdue_count = VaccineRecord.objects.filter(
            user=user, 
            status='scheduled',
            scheduled_date__lt=timezone.now().date()
        ).count()
        
        # Próximas vacunas (30 días)
        upcoming_date = timezone.now().date() + timedelta(days=30)
        upcoming_count = VaccineRecord.objects.filter(
            user=user,
            status='scheduled',
            scheduled_date__lte=upcoming_date
        ).count()
        
        # Vacunas por tipo
        vaccines_by_type = VaccineRecord.objects.filter(
            user=user
        ).values(
            'vaccine_type__name'
        ).annotate(
            total=Count('id'),
            applied=Count('id', filter=Q(status='applied'))
        )
        
        return Response({
            'total_records': total_records,
            'applied_count': applied_count,
            'pending_count': pending_count,
            'overdue_count': overdue_count,
            'upcoming_count': upcoming_count,
            'completion_rate': (applied_count / total_records * 100) if total_records > 0 else 0,
            'vaccines_by_type': list(vaccines_by_type)
        })
