from django.db import models
from django.core.exceptions import ValidationError
from datetime import date, timedelta
from accounts.models import User
import os

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
        raise ValidationError('Only .jpg, .jpeg, .png or .pdf files are allowed.')

def validate_file_size(value):
    limit = 2 * 1024 * 1024  
    if value.size > limit:
        raise ValidationError('File size must not exceed 2MB.')

class MedicalPrescription(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    issue_date = models.DateField()
    institution = models.CharField(max_length=150)
    prescribing_doctor = models.CharField(max_length=150)
    specialty = models.CharField(max_length=100)
    
    description = models.TextField(blank=True, null=True)  
    medications = models.TextField(blank=True, null=True)  
    
    file = models.FileField(
        upload_to='prescriptions/',
        validators=[validate_file_extension, validate_file_size]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return date.today() - self.issue_date <= timedelta(days=180)

    def __str__(self):
        return f"{self.patient.email} - {self.issue_date}"