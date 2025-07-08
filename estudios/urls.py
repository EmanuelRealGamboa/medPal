from rest_framework.routers import DefaultRouter
from .views import EstudioGabineteViewSet, EstudioLaboratorioViewSet, EstudioFuncionalViewSet

router = DefaultRouter()
router.register(r'gabinete', EstudioGabineteViewSet)
router.register(r'laboratorio', EstudioLaboratorioViewSet)
router.register(r'funcionales', EstudioFuncionalViewSet)

urlpatterns = router.urls
