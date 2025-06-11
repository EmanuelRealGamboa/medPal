# accounts/urls.py
from django.urls import path
from .views import SignupView, VerifyCodeView, SigninView, LogoutView

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('verify/', VerifyCodeView.as_view()),
    path('signin/', SigninView.as_view()),
    path('logout/', LogoutView.as_view()),
]