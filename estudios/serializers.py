from rest_framework import serializers
from .models import EstudioGabinete, EstudioLaboratorio, EstudioFuncional

class EstudioGabineteSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstudioGabinete
        fields = '__all__'


class EstudioLaboratorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstudioLaboratorio
        fields = '__all__'


class EstudioFuncionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstudioFuncional
        fields = '__all__'