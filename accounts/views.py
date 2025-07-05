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
from rest_framework import generics, permissions, status
from .models import Perfil
from .serializers import PerfilSerializer
from rest_framework import generics, permissions
from .models import Reminder
from .serializers import ProfileSerializer, ReminderSerializer
from .models import PersonalData, MedicalHistory
from .serializers import PersonalDataSerializer, MedicalHistorySerializer
#Definimos que User sera nuestro modelo que hemos hecho en models.py (Modelo editado)
User = get_user_model()




class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            # Generar código
            code = str(random.randint(100000, 999999))

            # Guardar datos sin crear cuenta aún
            user = serializer.save(verification_code=code, is_active=False)
            user.verification_code_created_at = timezone.now()
            user.save()

            # Enviar correo
            send_mail(
                subject='Código de verificación',
                message=f'Tu código de verificación es: {code}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )

            return Response({'message': 'Código enviado al correo'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class ProfileRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    """
    GET → devuelve datos del perfil del usuario autenticado.
    PUT → actualiza datos (email, nombres, teléfono).
    """
    serializer_class    = ProfileSerializer
    permission_classes  = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ReminderListCreateAPIView(generics.ListCreateAPIView):
    """
    GET  → lista todos los recordatorios del usuario autenticado.
    POST → crea un nuevo recordatorio.
    """
    serializer_class   = ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # solo los del usuario actual
        return Reminder.objects.filter(user=self.request.user).order_by('-remind_at')

    def perform_create(self, serializer):
        # asignar automáticamente al usuario
        serializer.save(user=self.request.user)





class PersonalDataRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET → ver datos personales
    PUT/PATCH → actualizar datos personales
    """
    serializer_class   = PersonalDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # crea el objeto si no existe
        obj, _ = PersonalData.objects.get_or_create(user=self.request.user)
        return obj


class MedicalHistoryListCreateView(generics.ListCreateAPIView):
    """
    GET  → lista antecedentes médicos
    POST → añadir un nuevo antecedente
    """
    serializer_class   = MedicalHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalHistory.objects.filter(user=self.request.user).order_by('-diagnostico')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MedicalHistoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    → ver un antecedente
    PUT/PATCH → actualizar
    DELETE → borrar
    """
    serializer_class   = MedicalHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalHistory.objects.filter(user=self.request.user)




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
            if str(user.verification_code) == str(code):  # <-- comparando correctamente
                user.is_active = True
                user.clear_verification_code()
                return Response({'status': 'ok', 'message': 'Cuenta verificada correctamente'})
            else:
                return Response({'status': 'error', 'message': 'Código incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)




class SigninView(APIView):
    def post(self, request):
        serializer = SigninSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LogoutView(APIView):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({"message": "Sesión cerrada."}, status=status.HTTP_200_OK)
    


class PerfilListCreateView(generics.ListCreateAPIView):
    """
    GET: lista todos los perfiles del jefe autenticado.
    POST: crea un nuevo perfil asociado al jefe.
    """
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Perfil.objects.filter(jefe=self.request.user)

    def perform_create(self, serializer):
        serializer.save(jefe=self.request.user)


class PerfilDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: recupera un perfil en particular (si pertenece al jefe).
    PUT/PATCH: actualiza los datos del perfil.
    DELETE: borra el perfil.
    """
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Perfil.objects.filter(jefe=self.request.user)


class PerfilDownloadView(generics.GenericAPIView):
    """
    GET: genera y sirve un archivo (p.ej. PDF) con la info del perfil.
    """
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        perfil = generics.get_object_or_404(Perfil, pk=pk, jefe=request.user)
        # Aquí podrías generar un PDF o CSV dinámicamente.
        # Por simplicidad, retornamos JSON con un campo 'download_url'.
        return Response({
            "download_url": f"/media/perfiles/{perfil.id}.pdf"
        })
        try:
            # Eliminar el token si existe
            if hasattr(request.user, 'auth_token'):
                request.user.auth_token.delete()
            
            # Cerrar sesión
            logout(request)
            
            return Response({"message": "Sesión cerrada exitosamente."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Error al cerrar sesión."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    





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
                    message=f'Hola {user.name},\n\nHas solicitado cambiar tu contraseña.\n\nTu código de verificación es: {code}\n\nEste código expirará en 5 minutos.\n\nSi no solicitaste este cambio, ignora este mensaje.\n\nSaludos,\nEquipo MedPal',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )

                return Response({"message": "Código enviado al correo electrónico."}, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"error": "Usuario no encontrado o inactivo."}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": "Error al enviar el correo. Intenta nuevamente."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
        
class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Enviar confirmación por correo
                send_mail(
                    subject='Contraseña actualizada - MedPal',
                    message=f'Hola {user.name},\n\nTu contraseña ha sido actualizada exitosamente.\n\nSi no realizaste este cambio, contacta inmediatamente a nuestro soporte.\n\nSaludos,\nEquipo MedPal',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,  # No fallar si no se puede enviar la confirmación
                )
                
                return Response({"message": "Contraseña actualizada con éxito."}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": "Error al actualizar la contraseña."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
