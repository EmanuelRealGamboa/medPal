from rest_framework import serializers
from .models import MenstrualRecord, Pregnancy, PregnancyCheck, ClinicalNote

class MenstrualRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenstrualRecord
        fields = '__all__'

class PregnancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregnancy
        fields = '__all__'

class PregnancyCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = PregnancyCheck
        fields = '__all__'

class ClinicalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalNote
        fields = '__all__'
