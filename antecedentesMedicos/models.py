from django.db import models
from accounts.models import Perfil  # Ajusta el import según tu estructura

# Create your models here.


class heredoFamiliares(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='heredoFamiliares')
    nombreEnfermedad = models.CharField(max_length=100)
    parentesco = models.CharField(max_length=100)
    tipoEnfermedad = models.TextField()
    edadDiacnosticoEnfermedad = models.IntegerField()
    estadoActual = models.CharField(max_length=50)

    def __str__(self):
        return self.nombreEnfermedad


class personalesPatologicos(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='personalesPatologicos')
    nombreEnfermedad = models.CharField(max_length=100)
    fechaDiagnostico = models.DateField()
    intervenciones  = models.CharField( max_length=100,blank=True, null=True)
    intervencionesFecha = models.DateTimeField(blank=True, null=True)
    intervencionesMotivo = models.CharField( max_length=100,blank=True, null=True)
    intervencionesLugar = models.TextField(blank=True, null=True)
    hospitalizacion  = models.CharField( max_length=100,blank=True, null=True)
    hospitalizacionFecha = models.DateTimeField(blank=True, null=True)
    hospitalizacionMotivo = models.CharField( max_length=100,blank=True, null=True)
    hospitalizacionLugar = models.TextField(blank=True, null=True)
    hospitalizacionTratamientos = models.TextField(blank=True, null=True)
    tratamientos = models.TextField(blank=True, null=True)
    nombreTratamientos = models.TextField(blank=True, null=True)
    dosisTratamientos = models.TextField(blank=True, null=True)
    reaccionesTratamientos = models.TextField(blank=True, null=True)
    frecuenciaTratamientos = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombreEnfermedad
    


class Alergias(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='alergias')
    tipo = models.TextField(help_text="Medicamentos, alimentos, sustancias ambientales", blank=True, null=True)
    reaccion = models.TextField(help_text="Ej: rash, dificultad respiratoria, anafilaxia", blank=True, null=True)
    fechaPrimerEvento = models.DateField(blank=True, null=True)
    frecuencia = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Alergia a {self.tipo}"




class Intolerancias(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='intolerancias')
    tipo = models.CharField(max_length=100, help_text="Ej: lactosa, gluten, fructosa", blank=True, null=True)
    sintomas = models.TextField(help_text="Síntomas experimentados y severidad", blank=True, null=True)
    diagnostico = models.TextField(help_text="Diagnóstico médico o autoinforme", blank=True, null=True)

    def __str__(self):
        return f"Intolerancia a {self.tipo}"


class personalesNoPatologicos(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='personalesNoPatologicos')
    tabaquismo = models.TextField(help_text="Tipo, frecuencia, duración en años", blank=True, null=True)
    alcohol = models.TextField(help_text="Frecuencia y cantidad promedio", blank=True, null=True)
    actividadFisica = models.TextField(help_text="Tipo, frecuencia semanal, intensidad", blank=True, null=True)
    alimentacion = models.TextField(help_text="Tipo de dieta habitual, restricciones, hábitos", blank=True, null=True)
    saludMental = models.TextField(help_text="Estrés, manejo emocional, terapia", blank=True, null=True)
    suenio = models.TextField(help_text="Calidad, duración, trastornos como insomnio o apnea", blank=True, null=True)

    def __str__(self):
        return "Antecedentes personales no patológicos"
