
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SignupSerializer, VerifyCodeSerializer, SigninSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
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
            if user.verification_code == code:
                user.is_active = True
                user.verification_code = ''
                user.save()
                return Response({'message': 'Cuenta verificada correctamente'})
            else:
                return Response({'error': 'Código incorrecto'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)


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