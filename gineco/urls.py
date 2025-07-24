from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenstrualRecordViewSet,
    PregnancyViewSet,
    PregnancyCheckViewSet,
    ClinicalNoteViewSet
)

router = DefaultRouter()
router.register(r'menstrual', MenstrualRecordViewSet)
router.register(r'pregnancies', PregnancyViewSet)
router.register(r'checks', PregnancyCheckViewSet)
router.register(r'notes', ClinicalNoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
