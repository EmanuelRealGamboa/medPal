<<<<<<< HEAD:accounts/serializers.py
# accounts/serializers.py
from rest_framework import serializers
from .models import User
from django.core.mail import send_mail
from .models import Perfil

#Leeme

"""Si estas Usando Django por primera vez, necesitas saber que Serializers
es como un puente en entre Json y Python enviar y recibir formato de Json a python y de python a Json"""





#SignUp Serializers(Json)

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
        user.set_password(password)
        user.verification_code = user.verification_code or User.objects.make_random_password(length=6, allowed_chars='0123456789')
        user.is_active = False
        user.save()

        send_mail(
            'Código de verificación',
            f'Tu código es: {user.verification_code}',
            'no-reply@tuapp.com',
            [user.email],
            fail_silently=False
        )

        return user

#Verification Code Serializadores (Json)

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

#Signin Serializers (Json)

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
    


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['id', 'nombre', 'fecha_nacimiento', 'relacion']
=======
from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            'email', 'first_name', 'last_name_paterno', 'last_name_materno',
            'phone', 'password', 'password2'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    def validate(self, data):
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        return data

    def create(self, validated_data):
        # Se quita password2 y se crea usuario
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name_paterno=validated_data['last_name_paterno'],
            last_name_materno=validated_data['last_name_materno'],
            phone=validated_data['phone'],
            password=validated_data['password']
        )

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")
        if not user.is_active:
            raise serializers.ValidationError("Cuenta desactivada.")
        data['user'] = user
        return data
>>>>>>> f1f5572f3869c3041e015a1b72e566090f648a67:api/serializers.py
