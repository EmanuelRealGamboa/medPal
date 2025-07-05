from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.utils import timezone
import random
import string
from django.contrib.auth.models import User
from django.db import models
from django.conf import settings
#Generador de codigo 
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))


class Reminder(models.Model):
    # Opciones: "cita" o "medicamento"
    TYPE_CHOICES = (
        ('cita', 'Cita médica'),
        ('med',  'Medicamento'),
    )
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminders')
    title      = models.CharField(max_length=200)
    remind_at  = models.DateTimeField()
    type       = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} ({self.get_type_display()})'



class PersonalData(models.Model):
    """
    Datos personales básicos del usuario.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='personal_data'
    )
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion        = models.CharField(max_length=255, blank=True)
    genero           = models.CharField(
        max_length=10,
        choices=(('M','Masculino'),('F','Femenino'),('O','Otro')),
        blank=True
    )

    def __str__(self):
        return f"Datos personales de {self.user.email}"


class MedicalHistory(models.Model):
    """
    Antecedentes médicos del usuario.
    """
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medical_history'
    )
    condicion  = models.CharField(max_length=200)
    diagnostico= models.DateField()
    notas      = models.TextField(blank=True)
    creado     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.condicion} ({self.user.email})"



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
