from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalPrescriptionViewSet

router = DefaultRouter()
router.register(r'prescriptions', MedicalPrescriptionViewSet, basename='prescription')

urlpatterns = [
    path('', include(router.urls)),
]
