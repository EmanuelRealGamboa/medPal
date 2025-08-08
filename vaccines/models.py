from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class VaccineType(models.Model):
    """Catálogo de tipos de vacunas disponibles"""
    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre de la vacuna")
    description = models.TextField(blank=True, verbose_name="Descripción")
    manufacturer = models.CharField(max_length=100, blank=True, verbose_name="Fabricante")
    doses_required = models.PositiveIntegerField(default=1, verbose_name="Dosis requeridas")
    interval_days = models.PositiveIntegerField(
        null=True, blank=True, 
        verbose_name="Intervalo entre dosis (días)",
        help_text="Días entre dosis para vacunas de múltiples aplicaciones"
    )
    age_min_months = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name="Edad mínima (meses)",
        help_text="Edad mínima recomendada para aplicación"
    )
    age_max_months = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name="Edad máxima (meses)",
        help_text="Edad máxima recomendada para aplicación"
    )
    is_active = models.BooleanField(default=True, verbose_name="Activa")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Tipo de Vacuna"
        verbose_name_plural = "Tipos de Vacunas"
        ordering = ['name']

    def __str__(self):
        return self.name

class VaccineRecord(models.Model):
    """Registro de vacunas aplicadas a usuarios"""
    
    STATUS_CHOICES = [
        ('applied', 'Aplicada'),
        ('scheduled', 'Programada'),
        ('overdue', 'Vencida'),
        ('cancelled', 'Cancelada'),
    ]
    
    REACTION_CHOICES = [
        ('none', 'Ninguna'),
        ('mild', 'Leve'),
        ('moderate', 'Moderada'),
        ('severe', 'Severa'),
    ]

    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='vaccine_records',
        verbose_name="Usuario"
    )
    vaccine_type = models.ForeignKey(
        VaccineType, 
        on_delete=models.CASCADE,
        verbose_name="Tipo de vacuna"
    )
    dose_number = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name="Número de dosis"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='scheduled',
        verbose_name="Estado"
    )
    
    # Fechas
    scheduled_date = models.DateField(
        verbose_name="Fecha programada",
        help_text="Fecha en que debe aplicarse la vacuna"
    )
    applied_date = models.DateField(
        null=True, blank=True,
        verbose_name="Fecha de aplicación",
        help_text="Fecha real en que se aplicó la vacuna"
    )
    
    # Información médica
    healthcare_provider = models.CharField(
        max_length=200, blank=True,
        verbose_name="Proveedor de salud",
        help_text="Hospital, clínica o centro de salud"
    )
    doctor_name = models.CharField(
        max_length=150, blank=True,
        verbose_name="Nombre del médico"
    )
    batch_number = models.CharField(
        max_length=50, blank=True,
        verbose_name="Número de lote"
    )
    
    # Reacciones y observaciones
    reaction = models.CharField(
        max_length=20,
        choices=REACTION_CHOICES,
        default='none',
        verbose_name="Reacción"
    )
    reaction_notes = models.TextField(
        blank=True,
        verbose_name="Notas sobre reacciones",
        help_text="Descripción detallada de cualquier reacción"
    )
    notes = models.TextField(
        blank=True,
        verbose_name="Observaciones generales"
    )
    
    # Metadatos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='created_vaccine_records',
        verbose_name="Creado por"
    )

    class Meta:
        verbose_name = "Registro de Vacuna"
        verbose_name_plural = "Registros de Vacunas"
        ordering = ['-scheduled_date', '-applied_date']
        unique_together = ['user', 'vaccine_type', 'dose_number']

    def __str__(self):
        return f"{self.user.email} - {self.vaccine_type.name} (Dosis {self.dose_number})"

    def save(self, *args, **kwargs):
        # Auto-actualizar estado basado en fechas
        if self.applied_date:
            self.status = 'applied'
        elif self.scheduled_date < timezone.now().date() and self.status == 'scheduled':
            self.status = 'overdue'
        
        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        """Verifica si la vacuna está vencida"""
        return (self.status == 'scheduled' and 
                self.scheduled_date < timezone.now().date())

    @property
    def days_until_due(self):
        """Días hasta la fecha programada (negativo si está vencida)"""
        if self.status != 'scheduled':
            return None
        delta = self.scheduled_date - timezone.now().date()
        return delta.days

    @property
    def next_dose_date(self):
        """Calcula la fecha de la siguiente dosis"""
        if (self.status == 'applied' and 
            self.dose_number < self.vaccine_type.doses_required and
            self.vaccine_type.interval_days):
            
            base_date = self.applied_date or self.scheduled_date
            return base_date + timedelta(days=self.vaccine_type.interval_days)
        return None

class VaccineAlert(models.Model):
    """Alertas y recordatorios de vacunas"""
    
    ALERT_TYPES = [
        ('upcoming', 'Próxima vacuna'),
        ('overdue', 'Vacuna vencida'),
        ('next_dose', 'Siguiente dosis'),
        ('annual_reminder', 'Recordatorio anual'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='vaccine_alerts',
        verbose_name="Usuario"
    )
    vaccine_record = models.ForeignKey(
        VaccineRecord,
        on_delete=models.CASCADE,
        related_name='alerts',
        verbose_name="Registro de vacuna",
        null=True,
        blank=True
    )
    alert_type = models.CharField(
        max_length=20,
        choices=ALERT_TYPES,
        verbose_name="Tipo de alerta"
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        verbose_name="Prioridad"
    )
    message = models.TextField(verbose_name="Mensaje")
    alert_date = models.DateTimeField(
        verbose_name="Fecha de alerta",
        help_text="Cuándo debe mostrarse la alerta"
    )
    is_read = models.BooleanField(default=False, verbose_name="Leída")
    is_sent = models.BooleanField(default=False, verbose_name="Enviada")
    sent_at = models.DateTimeField(null=True, blank=True, verbose_name="Enviada en")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Alerta de Vacuna"
        verbose_name_plural = "Alertas de Vacunas"
        ordering = ['-alert_date', '-priority']

    def __str__(self):
        return f"Alerta: {self.get_alert_type_display()} - {self.user.email}"

    def mark_as_read(self):
        """Marca la alerta como leída"""
        self.is_read = True
        self.save()

    def mark_as_sent(self):
        """Marca la alerta como enviada"""
        self.is_sent = True
        self.sent_at = timezone.now()
        self.save()
