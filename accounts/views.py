
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