# accounts/urls.py
from django.urls import path
from .views import SignupView, VerifyCodeView, SigninView, LogoutView
from .views import (
    PerfilListCreateView,
    PerfilDetailView,
    PerfilDownloadView,
)


#Rutas para los Edpoints

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('verify/', VerifyCodeView.as_view()),
    path('signin/', SigninView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('perfiles/', PerfilListCreateView.as_view(), name='perfiles-list-create'),
    path('perfiles/<int:pk>/', PerfilDetailView.as_view(), name='perfiles-detail'),
    path('perfiles/<int:pk>/download/', PerfilDownloadView.as_view(), name='perfil-download'),
]

