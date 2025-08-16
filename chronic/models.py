from django.conf import settings
from django.db import models
from django.utils import timezone

class ClinicalStatus(models.TextChoices):
    CONTROLADO = 'CONTROLLED', 'Controlado'
    MAL_CONTROLADO = 'POORLY_CONTROLLED', 'Mal controlado'
    REMISION = 'REMISSION', 'En remisión'
    PROGRESIVO = 'PROGRESSIVE', 'Progresivo'

class Frequency(models.TextChoices):
    RARA_VEZ = 'RARE', 'Rara vez'
    OCASIONAL = 'OCCASIONAL', 'Ocasional'
    FRECUENTE = 'FREQUENT', 'Frecuente'
    DIARIA = 'DAILY', 'Diaria'

class Intensity(models.TextChoices):
    LEVE = 'MILD', 'Leve'
    MODERADA = 'MODERATE', 'Moderada'
    SEVERA = 'SEVERE', 'Severa'

class ChronicCondition(models.Model):
    """Enfermedad crónica por paciente (relación directa al usuario dueño)."""
    patient_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chronic_conditions'
    )
    disease_name = models.CharField(max_length=160)  # nombre clínico completo
    diagnosis_date = models.DateField()              # fecha diagnóstico confirmado
    age_at_diagnosis = models.PositiveSmallIntegerField()  # edad (años) al diagnóstico
    diagnosing_institution = models.CharField(max_length=160, blank=True)
    diagnosing_physician = models.CharField(max_length=160, blank=True)
    current_status = models.CharField(
        max_length=24, choices=ClinicalStatus.choices, default=ClinicalStatus.CONTROLADO
    )
    classification_system = models.CharField(max_length=80, blank=True)   # p.ej. ADA, GINA, GOLD
    classification_level = models.CharField(max_length=40, blank=True)    # p.ej. leve/moderado/GOLD2
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['patient_user', 'disease_name']),
            models.Index(fields=['current_status']),
        ]

    def clean(self):
        """Reglas clínicas básicas."""
        from django.core.exceptions import ValidationError
        if self.diagnosis_date > timezone.localdate():
            raise ValidationError({'diagnosis_date': 'La fecha de diagnóstico no puede ser futura.'})
        if not (0 <= self.age_at_diagnosis <= 120):
            raise ValidationError({'age_at_diagnosis': 'La edad al diagnóstico debe estar entre 0 y 120.'})

    def __str__(self):
        return f"{self.patient_user} - {self.disease_name}"

class Symptom(models.Model):
    condition = models.ForeignKey(ChronicCondition, on_delete=models.CASCADE, related_name='symptoms')
    name = models.CharField(max_length=120)
    present = models.BooleanField(default=True)
    frequency = models.CharField(max_length=16, choices=Frequency.choices, default=Frequency.OCASIONAL)
    intensity = models.CharField(max_length=16, choices=Intensity.choices, default=Intensity.LEVE)

    class Meta:
        unique_together = ('condition', 'name')

    def __str__(self):
        return f"{self.name} ({self.intensity})"

class Complication(models.Model):
    condition = models.ForeignKey(ChronicCondition, on_delete=models.CASCADE, related_name='complications')
    name = models.CharField(max_length=160)
    notes = models.CharField(max_length=240, blank=True)

    class Meta:
        unique_together = ('condition', 'name')

    def __str__(self):
        return self.name
