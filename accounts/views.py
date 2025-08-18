from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, VerifyCodeSerializer, SigninSerializer, RequestPasswordResetSerializer, ResetPasswordSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
import random
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import UserSerializer

from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import PerfilSerializer
from .models import Perfil
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .serializers import PersonalDataSerializer
from .models import PersonalData


# Modelo de usuario
User = get_user_model()


# ===========================
# Auth Views
# ===========================



#Definimos que User sera nuestro modelo que hemos hecho en models.py (Modelo editado)
User = get_user_model()


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            code = str(random.randint(100000, 999999))
            user = serializer.save(verification_code=code, is_active=False)
            user.verification_code_created_at = timezone.now()
            user.save()

            send_mail(
                subject='Código de verificación',
                message=f'Tu código de verificación es: {code}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({'message': 'Código enviado al correo'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyCodeView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            user = User.objects.get(email=email)
            if not user.verification_code:
                return Response({'status': 'error', 'message': 'No hay código de verificación activo'}, status=status.HTTP_400_BAD_REQUEST)
            if user.is_verification_code_expired():
                return Response({'status': 'error', 'message': 'El código de verificación ha expirado. Solicita uno nuevo'}, status=status.HTTP_400_BAD_REQUEST)
            if str(user.verification_code) == str(code):
                user.is_active = True
                user.clear_verification_code()
                return Response({'status': 'ok', 'message': 'Cuenta verificada correctamente'})
            return Response({'status': 'error', 'message': 'Código incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


class SigninView(APIView):
    def post(self, request):
        serializer = SigninSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
    "token": token.key,
    "username": user.name,  # o user.email si no hay nombre
    "email": user.email
})


        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response({"message": "Sesión cerrada exitosamente."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Error al cerrar sesión."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ===========================
# Password Reset
# ===========================

class RequestPasswordResetView(APIView):
    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email, is_active=True)
                code = str(random.randint(100000, 999999))
                user.verification_code = code
                user.verification_code_created_at = timezone.now()
                user.save()

                send_mail(
                    subject='Código para cambiar tu contraseña - MedPal',
                    message=f'Hola {user.username}, tu código de verificación es: {code}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
                return Response({"message": "Código enviado al correo electrónico."}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "Usuario no encontrado o inactivo."}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                send_mail(
                    subject='Contraseña actualizada - MedPal',
                    message=f'Hola {user.username}, tu contraseña ha sido actualizada exitosamente.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
                return Response({"message": "Contraseña actualizada con éxito."}, status=status.HTTP_200_OK)
            except Exception:
                return Response({"error": "Error al actualizar la contraseña."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===========================
# Users Info
# ===========================

class UserListCreateAPIView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===========================
# Perfiles
# ===========================

class PerfilListCreateView(generics.ListCreateAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Perfil.objects.filter(jefe=self.request.user)

    def perform_create(self, serializer):
        serializer.save(jefe=self.request.user)


class PerfilDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Perfil.objects.filter(jefe=self.request.user)


class PerfilDownloadView(generics.GenericAPIView):
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        perfil = get_object_or_404(Perfil, pk=pk, jefe=request.user)
        return Response({"download_url": f"/media/perfiles/{perfil.id}.pdf"})


# ===========================
# PersonalData
# ===========================

class PersonalDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        if PersonalData.objects.filter(user=user).exists():
            return Response({"message": "Ya tienes datos personales guardados. Usa PUT para actualizar."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            personal_data = PersonalData.objects.get(user=request.user)
        except PersonalData.DoesNotExist:
            return Response({"message": "Datos personales no encontrados."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonalDataSerializer(personal_data, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        try:
            personal_data = PersonalData.objects.get(user=request.user)
        except PersonalData.DoesNotExist:
            return Response({"message": "Datos personales no encontrados."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PersonalDataSerializer(personal_data, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PersonalDataRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = PersonalDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, _ = PersonalData.objects.get_or_create(user=self.request.user)
        return obj
