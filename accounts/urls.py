# accounts/urls.py
from django.urls import path
from .views import SignupView, VerifyCodeView, SigninView, LogoutView
<<<<<<< HEAD
from .views import (
    PerfilListCreateView,
    PerfilDetailView,
    PerfilDownloadView,
)

=======
from .views import RequestPasswordResetView, ResetPasswordView
>>>>>>> 90ed2677ced350331c7d5af601b3c7b32038f676

#Rutas para los Edpoints

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('verify/', VerifyCodeView.as_view()),
    path('signin/', SigninView.as_view()),
    path('logout/', LogoutView.as_view()),
<<<<<<< HEAD
    path('perfiles/', PerfilListCreateView.as_view(), name='perfiles-list-create'),
    path('perfiles/<int:pk>/', PerfilDetailView.as_view(), name='perfiles-detail'),
    path('perfiles/<int:pk>/download/', PerfilDownloadView.as_view(), name='perfil-download'),
]

=======
    path('request-password-reset/', RequestPasswordResetView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
]
>>>>>>> 90ed2677ced350331c7d5af601b3c7b32038f676
