from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import random
import string

# Generador de código de verificación de 6 dígitos
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

# Validadores
only_letters = RegexValidator(
    regex=r'^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$',
    message='Este campo solo puede contener letras y espacios.'
)

ten_digits_only = RegexValidator(
    regex=r'^\d{10}$',
    message='El número de teléfono debe contener exactamente 10 dígitos numéricos.'
)

# -------------------------------
# MODELOS
# -------------------------------

class Reminder(models.Model):
    TYPE_CHOICES = (
        ('cita', 'Cita médica'),
        ('med', 'Medicamento'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminders')
    title = models.CharField(max_length=200)
    remind_at = models.DateTimeField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} ({self.get_type_display()})'


class MedicalHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medical_history'
    )
    condicion = models.CharField(max_length=200)
    diagnostico = models.DateField()
    notas = models.TextField(blank=True)
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.condicion} ({self.user.email})"


class PersonalData(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='personal_data'
    )
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.CharField(max_length=255, blank=True)
    genero = models.CharField(
        max_length=10,
        choices=(('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')),
        blank=True
    )

    def __str__(self):
        return f"Datos personales de {self.user.email}"


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100, validators=[only_letters])
    apellido_paterno = models.CharField(max_length=100, validators=[only_letters])
    apellido_materno = models.CharField(max_length=100, validators=[only_letters])
    phone = models.CharField(max_length=10, validators=[ten_digits_only], default="0000000000")
    contactoEmergencia = models.CharField(max_length=10, validators=[ten_digits_only], default="0000000000")
    photoUser = models.ImageField(upload_to="user_photos/", null=True, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True)
    verification_code_created_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone']

    def __str__(self):
        return self.email


class Perfil(models.Model):
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
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_created_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre} ({self.relacion})"

    def is_verification_code_expired(self):
        if not self.verification_code_created_at:
            return True
        expiration_time = self.verification_code_created_at + timedelta(minutes=5)
        return timezone.now() > expiration_time

    def clear_verification_code(self):
        self.verification_code = ''
        self.verification_code_created_at = None
        self.save()
