from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import VerificationCode
import random


from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile
from .models import VerificationCode  # Asumo que ya tienes este modelo

class SignupSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("El email ya está registrado")
        return value

    def validate_phone(self, value):
        if Profile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("El teléfono ya está registrado")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # Username con email
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['full_name'],
            last_name=validated_data['last_name'],
            is_active=False
        )
        # Guardar teléfono en el perfil
        user.profile.phone = validated_data['phone']
        user.profile.save()

        # Generar códigos para email y teléfono
        code_email = "%06d" % random.randint(0, 999999)
        code_phone = "%06d" % random.randint(0, 999999)

        VerificationCode.objects.create(user=user, email=user.email, code=code_email, purpose='signup')
        VerificationCode.objects.create(user=user, phone=validated_data['phone'], code=code_phone, purpose='signup')

        # Simula el envío de los códigos (debes integrar tu sistema real)
        print(f"Enviar código {code_email} a email {user.email}")
        print(f"Enviar código {code_phone} a teléfono {validated_data['phone']}")

        return user























class VerifySignupCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no existe")

        # Buscar código para signup sin verificar y no expirado
        try:
            vcode = VerificationCode.objects.get(
                user=user,
                email=data['email'],
                code=data['code'],
                purpose='signup',
                verified=False
            )
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError("Código inválido")

        if vcode.is_expired():
            raise serializers.ValidationError("Código expirado")

        data['user'] = user
        data['verification_code'] = vcode
        return data

    def save(self):
        user = self.validated_data['user']
        vcode = self.validated_data['verification_code']
        vcode.verified = True
        vcode.save()

        # Activar usuario
        user.is_active = True
        user.save()
        return user


class SigninSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Email o contraseña incorrectos")
        if not user.is_active:
            raise serializers.ValidationError("Usuario no activo")

        data['user'] = user
        return data


class VerifySigninCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()

    def validate(self, data):
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no existe")

        try:
            vcode = VerificationCode.objects.get(
                user=user,
                email=data['email'],
                code=data['code'],
                purpose='signin',
                verified=False
            )
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError("Código inválido")

        if vcode.is_expired():
            raise serializers.ValidationError("Código expirado")

        data['user'] = user
        data['verification_code'] = vcode
        return data

    def save(self):
        vcode = self.validated_data['verification_code']
        vcode.verified = True
        vcode.save()
        return self.validated_data['user']