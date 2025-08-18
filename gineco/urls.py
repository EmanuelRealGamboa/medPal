from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenstrualRecordViewSet,
    PregnancyViewSet,
    PregnancyCheckViewSet,
    ClinicalNoteViewSet,
    prediccion_por_perfil,
    embarazos_por_perfil,
    checks_por_perfil,
    notes_por_perfil
)

# Rutas automáticas para los ViewSet
router = DefaultRouter()
router.register(r'menstrual', MenstrualRecordViewSet)
router.register(r'pregnancies', PregnancyViewSet)
router.register(r'checks', PregnancyCheckViewSet)
router.register(r'notes', ClinicalNoteViewSet)

# Rutas finales
urlpatterns = [
    path('', include(router.urls)),
    path('menstrual/<int:perfilId>/prediccion/', prediccion_por_perfil),  
    path('pregnancies/<int:perfilId>/', embarazos_por_perfil),
    path('checks/<int:perfilId>/', checks_por_perfil),  
    path('notes/<int:perfilId>/', notes_por_perfil),
]
