from django.db import models
from django.core.exceptions import ValidationError
from cloudinary_storage.storage import MediaCloudinaryStorage
from datetime import date, timedelta
import os
from django.conf import settings  # importante

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
        raise ValidationError('Only .jpg, .jpeg, .png or .pdf files are allowed.')

def validate_file_size(value):
    limit = 2 * 1024 * 1024  
    if value.size > limit:
        raise ValidationError('File size must not exceed 2MB.')

class MedicalPrescription(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    patient_name = models.CharField(max_length=150)
    issue_date = models.DateField()
    institution = models.CharField(max_length=150)
    prescribing_doctor = models.CharField(max_length=150)
    specialty = models.CharField(max_length=100)
    
    description = models.TextField(blank=True, null=True)
    medications = models.TextField(blank=True, null=True)

    file = models.FileField(
        storage=MediaCloudinaryStorage(),  
        upload_to='medpal/prescriptions/',  
        validators=[validate_file_extension, validate_file_size]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return date.today() - self.issue_date <= timedelta(days=180)

    def __str__(self):
        return f"{self.patient_name} - {self.issue_date}"
