# accounts/urls.py


from django.urls import path
from .views import SignupView, VerifyCodeView, SigninView, LogoutView
from .views import RequestPasswordResetView, ResetPasswordView,UserListCreateAPIView


from django.urls import path
from .views import (
    SignupView,
    VerifyCodeView,
    SigninView,
    LogoutView,
    PerfilListCreateView,
    PerfilDetailView,
    PerfilDownloadView,
    PersonalDataRetrieveUpdateView,
    RequestPasswordResetView,
    ResetPasswordView
)


urlpatterns = [

    # Autenticación
    path('signup/', SignupView.as_view(), name='signup'),
    path('verify/', VerifyCodeView.as_view(), name='verify-code'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('users/', UserListCreateAPIView.as_view(), name='user-list-create'),

# Perfiles (jefe de familia)

    path('perfiles/', PerfilListCreateView.as_view(), name='perfiles-list-create'),
    path('perfiles/<int:pk>/', PerfilDetailView.as_view(), name='perfiles-detail'),
    path('perfiles/<int:pk>/download/', PerfilDownloadView.as_view(), name='perfil-download'),

    # Datos personales (OneToOne)
    path('personal-data/', PersonalDataRetrieveUpdateView.as_view(), name='personal-data'),


    
]
