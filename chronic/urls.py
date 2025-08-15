from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChronicConditionViewSet

router = DefaultRouter()
router.register(r'chronic-conditions', ChronicConditionViewSet, basename='chronic-conditions')

urlpatterns = [path('', include(router.urls))]
