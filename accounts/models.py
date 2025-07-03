from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.utils import timezone
import random
import string
from django.contrib.auth.models import User

# Generador de código de verificación de 6 dígitos
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        
        # Por defecto activamos el usuario para que pueda loguearse
        extra_fields.setdefault('is_active', True)
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Forzar permisos para superusuario
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)  # también activo

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
only_letters = RegexValidator(
    regex=r'^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$',
    message='Este campo solo puede contener letras y espacios.'
    
)  

ten_digits_only = RegexValidator(
    regex=r'^\d{10}$',
    message='El número de teléfono debe contener exactamente 10 dígitos numéricos.'
)

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100,validators=[only_letters])
    apellido_paterno = models.CharField(max_length=100,validators=[only_letters])
    apellido_materno = models.CharField(max_length=100,validators=[only_letters])
    phone = models.CharField(max_length=10, validators=[ten_digits_only]) 
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)  # activado por defecto para login
    is_staff = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True)
    verification_code_created_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone',]  # Aquí podrías agregar 'name', 'phone', etc. si quieres que sea obligatorio en createsuperuser

    def __str__(self):
        return self.email
    
<<<<<<< HEAD

class Perfil(models.Model):
    """
    Representa un perfil agregado por un Jefe de Familia.
    """
    jefe = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='perfiles'
    )
    nombre = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    relacion = models.CharField(
        max_length=50,
        help_text="p.ej. 'Hijo', 'Esposa', etc."
    )

    def __str__(self):
        return f"{self.nombre} ({self.relacion})"
=======
    def is_verification_code_expired(self):
        """Verifica si el código de verificación ha expirado (5 minutos)"""
        if not self.verification_code_created_at:
            return True
        from datetime import timedelta
        expiration_time = self.verification_code_created_at + timedelta(minutes=5)
        return timezone.now() > expiration_time
    
    def clear_verification_code(self):
        """Limpia el código de verificación y su timestamp"""
        self.verification_code = ''
        self.verification_code_created_at = None
        self.save()
>>>>>>> 90ed2677ced350331c7d5af601b3c7b32038f676
