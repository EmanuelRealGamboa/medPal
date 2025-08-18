from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MenstrualRecordViewSet,
    PregnancyViewSet,
    PregnancyCheckViewSet,
    ClinicalNoteViewSet,
    prediccion_por_perfil  # 👈 Importamos la vista personalizada
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
    path('menstrual/<int:perfilId>/prediccion/', prediccion_por_perfil),  # 👈 Ruta personalizada
]