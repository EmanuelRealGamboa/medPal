from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
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
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
    
#Modelo Usuario (Personalizado) ya que agregamos mas campos y no se esta usando el Default de Django

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True)  # Unique=Unico
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

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
