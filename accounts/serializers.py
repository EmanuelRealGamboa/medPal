# accounts/serializers.py
from rest_framework import serializers
from .models import User


# Leeme
"""
Si estás usando Django por primera vez, necesitas saber que Serializers
es como un puente entre JSON y Python. Permite enviar y recibir datos en formato JSON
y convertirlos a objetos de Python, y viceversa.
"""


# SignUp Serializer (para registro)
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('name', 'apellido_paterno', 'apellido_materno', 'phone', 'email', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # Encripta la contraseña
        user.is_active = False  # Se activa cuando verifique el código
        user.save()
        return user


# Verification Code Serializer (para verificar el código enviado por correo)
class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'], verification_code=data['code'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Código inválido o correo incorrecto.")
        return data

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        user.is_active = True
        user.verification_code = ''
        user.save()


# Signin Serializer (para iniciar sesión)
class SigninSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(email=data['email'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Credenciales inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("Verifica tu correo electrónico antes de iniciar sesión.")
        data['user'] = user
        return data