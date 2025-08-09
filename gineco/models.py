from django.db import models
from django.conf import settings
from datetime import timedelta
from django.utils import timezone

class MenstrualRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='menstrual_records')
    fecha_ultima_menstruacion = models.DateField()
    duracion_promedio_ciclo = models.PositiveSmallIntegerField(help_text='Días entre inicio de un sangrado y el siguiente')
    duracion_promedio_sangrado = models.PositiveSmallIntegerField(help_text='Duración promedio del periodo en días')
    es_regular = models.BooleanField(help_text='Ciclos regulares o irregulares')
    sintomas = models.TextField(blank=True, help_text='Síntomas físicos o emocionales')
    observaciones = models.TextField(blank=True, help_text='Observaciones (estrés, viajes…)')
    medicacion_hormonal = models.CharField(max_length=255, blank=True, help_text='Medicamentos hormonales usados')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Registro Menstrual'
        verbose_name_plural = 'Registros Menstruales'

    def __str__(self):
        return f"MenstrualRecord({self.user.email} – FUM: {self.fecha_ultima_menstruacion})"


class Pregnancy(models.Model):
    RIESGO_CHOICES = [
        ('low', 'Bajo'),
        ('moderate', 'Moderado'),
        ('high', 'Alto'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pregnancies')
    fecha_ultima_menstruacion = models.DateField()
    fecha_probable_parto = models.DateField(blank=True, null=True)
    nivel_riesgo = models.CharField(max_length=10, choices=RIESGO_CHOICES)
    intervenciones = models.TextField(blank=True, help_text='Controles, medicamentos o derivaciones')

    def __str__(self):
        return f"Pregnancy({self.user.email} – FUM: {self.fecha_ultima_menstruacion})"


class PregnancyCheck(models.Model):
    pregnancy = models.ForeignKey(Pregnancy, on_delete=models.CASCADE, related_name='checks')
    mes_gestacional = models.PositiveSmallIntegerField(help_text='Mes 1–9')
    sintomas_fisicos = models.TextField(blank=True, help_text='Náuseas, edemas…')
    estado_emocional = models.TextField(blank=True)
    peso = models.DecimalField(max_digits=5, decimal_places=2, help_text='Kg')
    presion_arterial = models.CharField(max_length=20, blank=True)
    frecuencia_cardiaca = models.PositiveSmallIntegerField(blank=True, null=True)
    movimientos_fetales = models.BooleanField(help_text='Movimientos detectados')
    ultrasonido = models.FileField(upload_to='ultrasonidos/', blank=True, null=True, help_text='Subir archivo de ultrasonido (PDF, imagen)')
    observaciones = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Control de Embarazo'
        verbose_name_plural = 'Controles de Embarazo'

    def __str__(self):
        return f"Check mes {self.mes_gestacional} de {self.pregnancy.user.email}"


class ClinicalNote(models.Model):
    pregnancy = models.ForeignKey(Pregnancy, on_delete=models.CASCADE, related_name='notes')
    nota_medica = models.TextField()
    recomendaciones = models.TextField(blank=True, help_text='Dieta, ejercicio…')
    fecha_cita = models.DateField(blank=True, null=True, help_text='Próxima cita o análisis')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Nota Clínica'
        verbose_name_plural = 'Notas Clínicas'

    def __str__(self):
        return f"Nota {self.id} para {self.pregnancy.user.email}"
