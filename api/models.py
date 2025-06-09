from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name_paterno,
                    last_name_materno, phone, password=None, **extra):
        if not email:
            raise ValueError('Email obligatorio')
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name_paterno=last_name_paterno,
            last_name_materno=last_name_materno,
            phone=phone,
            **extra
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name_paterno,
                         last_name_materno, phone, password=None, **extra):
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name_paterno,
                                last_name_materno, phone, password, **extra)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField('Correo', unique=True)
    first_name = models.CharField('Nombre', max_length=150)
    last_name_paterno = models.CharField('Apellido Paterno', max_length=150)
    last_name_materno = models.CharField('Apellido Materno', max_length=150)
    phone = models.CharField('Teléfono', max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name_paterno', 'last_name_materno', 'phone']

    def __str__(self):
        return self.email
