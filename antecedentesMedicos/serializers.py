from rest_framework import serializers
from .models import (
    heredoFamiliares,
    personalesPatologicos,
    personalesNoPatologicos,
    Alergias,
    Intolerancias
)

class heredoFamiliaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = heredoFamiliares
        fields = '__all__'

class personalesPatologicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = personalesPatologicos
        fields = '__all__'

class personalesNoPatologicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = personalesNoPatologicos
        fields = '__all__'

class AlergiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alergias
        fields = '__all__'

class IntoleranciasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intolerancias
        fields = '__all__'

