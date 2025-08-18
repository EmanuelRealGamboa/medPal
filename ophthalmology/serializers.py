from rest_framework import serializers
from .models import OphthalmologyDiagnosis

class OphthalmologyDiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = OphthalmologyDiagnosis
        fields = '__all__'
        read_only_fields = ['created_at']
