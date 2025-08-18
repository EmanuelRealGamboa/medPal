from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OphthalmologyDiagnosisViewSet

router = DefaultRouter()
router.register(r'diagnoses', OphthalmologyDiagnosisViewSet, basename='ophthalmology-diagnosis')

urlpatterns = [
    path('', include(router.urls)),
]
INSTALLED_APPS = [
    ...,
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...,
]

# Permitir solo tu frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5176",
]
