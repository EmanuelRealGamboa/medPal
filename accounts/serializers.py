# accounts/serializers.py
from rest_framework import serializers
from .models import User
from django.core.mail import send_mail
from .models import Perfil
from .models import PersonalData, MedicalHistory
#Leeme

"""Si estas Usando Django por primera vez, necesitas saber que Serializers
es como un puente en entre Json y Python enviar y recibir formato de Json a python y de python a Json"""




class PersonalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PersonalData
        fields = ['fecha_nacimiento', 'direccion', 'genero']


class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = MedicalHistory
        fields = ['id', 'condicion', 'diagnostico', 'notas', 'creado']
        read_only_fields = ['id', 'creado']


#SignUp Serializers(Json)


from rest_framework import serializers
from .models import Perfil
from rest_framework import serializers
from .models import PersonalData



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
    
# SERIALIZER PARA LA INFORMACION DE EL USUARIO 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # O especifica campos si quieres limitar


class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['id', 'nombre', 'fecha_nacimiento', 'relacion']

    # Esto permite que se suban archivos correctamente en multipart/form-data
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.photoUser:
            request = self.context.get('request')
            if request is not None:
                data['photoUser'] = request.build_absolute_uri(instance.photoUser.url)
        return data




class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError("No existe un usuario activo con este correo electrónico.")
        return value

    
class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8)
    new_password2 = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        
        # Validar que el usuario existe y el código es correcto
        try:
            user = User.objects.get(email=data['email'])
            if not user.verification_code:
                raise serializers.ValidationError("No hay código de verificación activo.")
            if user.verification_code != data['code']:
                raise serializers.ValidationError("Código de verificación incorrecto.")
            if user.is_verification_code_expired():
                raise serializers.ValidationError("El código de verificación ha expirado. Solicita uno nuevo.")
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado.")
        
        return data

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        user.set_password(self.validated_data['new_password'])
        user.clear_verification_code()  # Limpiar el código después de usarlo
        return user

    



class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['id', 'nombre', 'fecha_nacimiento', 'relacion']





class PersonalDataSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PersonalData
        fields = ['fecha_nacimiento', 'direccion', 'genero']

