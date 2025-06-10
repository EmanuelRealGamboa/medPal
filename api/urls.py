from django.urls import path
from .views import (
    SignupView, VerifySignupCodeView,
    SigninView, VerifySigninCodeView,
    LogoutView
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('signup/verify/', VerifySignupCodeView.as_view(), name='verify-signup'),
    path('signin/', SigninView.as_view(), name='signin'),
    path('signin/verify/', VerifySigninCodeView.as_view(), name='verify-signin'),
    path('logout/', LogoutView.as_view(), name='logout'),
]

