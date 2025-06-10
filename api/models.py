from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class VerificationCode(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=10)  # "signup" o "signin"
    created_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)

    def is_expired(self):
        expiration_time = self.created_at + timedelta(minutes=10)
        return timezone.now() > expiration_time



class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, null=True, blank=True, unique=True)
 

    def __str__(self):
        return f"{self.user.username} Profile"

