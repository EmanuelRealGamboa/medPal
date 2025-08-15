from rest_framework import serializers
from .models import ChronicCondition, Symptom, Complication

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ('id', 'name', 'present', 'frequency', 'intensity')

class ComplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complication
        fields = ('id', 'name', 'notes')

class ChronicConditionSerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, required=False)
    complications = ComplicationSerializer(many=True, required=False)

    class Meta:
        model = ChronicCondition
        fields = (
            'id', 'patient_user', 'disease_name', 'diagnosis_date', 'age_at_diagnosis',
            'diagnosing_institution', 'diagnosing_physician',
            'current_status', 'classification_system', 'classification_level',
            'is_active', 'created_at', 'updated_at',
            'symptoms', 'complications'
        )
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        # Si viene un nivel de clasificación, debe venir el sistema que lo define.
        lvl = attrs.get('classification_level')
        sys = attrs.get('classification_system')
        if lvl and not sys:
            raise serializers.ValidationError(
                "Si indicas 'classification_level' debes incluir 'classification_system'."
            )
        return attrs

    def create(self, validated_data):
        symptoms_data = validated_data.pop('symptoms', [])
        complications_data = validated_data.pop('complications', [])
        condition = ChronicCondition.objects.create(**validated_data)
        for s in symptoms_data:
            Symptom.objects.create(condition=condition, **s)
        for c in complications_data:
            Complication.objects.create(condition=condition, **c)
        return condition

    def update(self, instance, validated_data):
        symptoms_data = validated_data.pop('symptoms', None)
        complications_data = validated_data.pop('complications', None)

        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # Reemplazo completo de colecciones si vienen en el payload
        if symptoms_data is not None:
            instance.symptoms.all().delete()
            for s in symptoms_data:
                Symptom.objects.create(condition=instance, **s)

        if complications_data is not None:
            instance.complications.all().delete()
            for c in complications_data:
                Complication.objects.create(condition=instance, **c)

        return instance
