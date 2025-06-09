from django.urls import path
from .views import RegisterAPIView, LoginAPIView

urlpatterns = [
    path('registro/', RegisterAPIView.as_view(), name='register'),
    path('login/',    LoginAPIView.as_view(),    name='login'),
]
