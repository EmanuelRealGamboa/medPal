from django.db import models

# Create your models here.

from django.db import models

class EstudioGabinete(models.Model):
    nombre = models.CharField(max_length=255)
    fecha_realizacion = models.DateField()
    centro_medico = models.CharField(max_length=255)
    motivo_clinico = models.TextField()
    resultado = models.TextField()
    archivo_pdf = models.FileField(upload_to='estudios/gabinete/pdf/', null=True, blank=True)
    imagenes = models.ImageField(upload_to='estudios/gabinete/imagenes/', null=True, blank=True)
    video = models.FileField(upload_to='estudios/gabinete/videos/', null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre

class EstudioLaboratorio(models.Model):
    nombre = models.CharField(max_length=255)
    fecha_muestra = models.DateField()
    laboratorio = models.CharField(max_length=255)
    tecnica = models.TextField(null=True, blank=True)
    valores = models.TextField()
    archivo_pdf = models.FileField(upload_to='estudios/laboratorio/pdf/', null=True, blank=True)
    accion_medica = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre
    

class EstudioFuncional(models.Model):
    nombre = models.CharField(max_length=255)
    fecha = models.DateField()
    tipo_estudio = models.CharField(max_length=255)
    duracion = models.CharField(max_length=100, null=True, blank=True)
    hallazgos = models.TextField()
    archivo_pdf = models.FileField(upload_to='estudios/funcional/pdf/', null=True, blank=True)
    video = models.FileField(upload_to='estudios/funcional/videos/', null=True, blank=True)
    interpretacion_automatica = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre