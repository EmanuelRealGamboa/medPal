# accounts/urls.py
from django.urls import path
from .views import SignupView, VerifyCodeView, SigninView, LogoutView
from .views import RequestPasswordResetView, ResetPasswordView

#Rutas para los Edpoints

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('verify/', VerifyCodeView.as_view()),
    path('signin/', SigninView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('request-password-reset/', RequestPasswordResetView.as_view()),
    path('reset-password/', ResetPasswordView.as_view()),
]