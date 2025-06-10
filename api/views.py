from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import (
    SignupSerializer, VerifySignupCodeSerializer,
    SigninSerializer, VerifySigninCodeSerializer
)
import random
from .models import VerificationCode

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]
    
    
    
    


class VerifySignupCodeView(generics.GenericAPIView):
    serializer_class = VerifySignupCodeSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"detail": "Usuario activado con éxito"}, status=status.HTTP_200_OK)


class SigninView(generics.GenericAPIView):
    serializer_class = SigninSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Generar código de signin y enviar correo (simulado)
        code = "%06d" % random.randint(0, 999999)
        VerificationCode.objects.create(user=user, email=user.email, code=code, purpose='signin')
        print(f"Enviar código {code} al correo {user.email}")

        return Response({"detail": "Código de verificación enviado. Por favor verifica para iniciar sesión."}, status=status.HTTP_200_OK)


class VerifySigninCodeView(generics.GenericAPIView):
    serializer_class = VerifySigninCodeSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Crear token DRF
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)


from rest_framework.views import APIView

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"detail": "Sesión cerrada"}, status=status.HTTP_200_OK)