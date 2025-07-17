from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    VaccineTypeViewSet, VaccineRecordViewSet, VaccineAlertViewSet,
    VaccinationCardView, VaccineScheduleView, VaccineStatsView
)

router = DefaultRouter()
router.register(r'types', VaccineTypeViewSet)
router.register(r'records', VaccineRecordViewSet, basename='vaccinerecord')
router.register(r'alerts', VaccineAlertViewSet, basename='vaccinealert')

urlpatterns = [
    path('', include(router.urls)),
    path('card/', VaccinationCardView.as_view(), name='vaccination-card'),
    path('schedule/', VaccineScheduleView.as_view(), name='vaccine-schedule'),
    path('stats/', VaccineStatsView.as_view(), name='vaccine-stats'),
]