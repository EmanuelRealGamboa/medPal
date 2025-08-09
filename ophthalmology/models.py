from django.db import models
from django.core.exceptions import ValidationError
from cloudinary_storage.storage import MediaCloudinaryStorage
import os


def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
        raise ValidationError('Only .jpg, .jpeg, .png or .pdf files are allowed.')

def validate_file_size(value):
    limit = 2 * 1024 * 1024  
    if value.size > limit:
        raise ValidationError('File size must not exceed 2MB.')


ATTENTION_TYPES = [
    ('routine', 'Routine Check-up'),
    ('followup', 'Chronic Condition Follow-up'),
    ('postop', 'Postoperative'),
    ('preventive', 'Preventive Screening'),
]

class OphthalmologyDiagnosis(models.Model):
    patient_name = models.CharField(max_length=100)
    exam_date = models.DateField()
    attention_type = models.CharField(max_length=20, choices=ATTENTION_TYPES, blank=True, null=True)
    diagnosis = models.TextField(help_text="Detailed visual diagnosis")
    notes = models.TextField(blank=True, null=True)

   
    document = models.FileField(
        storage=MediaCloudinaryStorage(), 
        upload_to='medpal/ophthalmology/',  
        validators=[validate_file_extension, validate_file_size]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.exam_date}"
