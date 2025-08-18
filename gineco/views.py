from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from accounts.models import Perfil
import traceback
from .models import MenstrualRecord, Pregnancy, PregnancyCheck, ClinicalNote
from .serializers import (
    MenstrualRecordSerializer,
    PregnancySerializer,
    PregnancyCheckSerializer,
    ClinicalNoteSerializer,
)

# Vista base que filtra por género femenino
class BaseGinecoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__personal_data__genero='F')


# ViewSets principales
class MenstrualRecordViewSet(BaseGinecoViewSet):
    queryset = MenstrualRecord.objects.all()
    serializer_class = MenstrualRecordSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class PregnancyViewSet(BaseGinecoViewSet):
    queryset = Pregnancy.objects.all()
    serializer_class = PregnancySerializer


class PregnancyCheckViewSet(BaseGinecoViewSet):
    queryset = PregnancyCheck.objects.all()
    serializer_class = PregnancyCheckSerializer


class ClinicalNoteViewSet(BaseGinecoViewSet):
    queryset = ClinicalNote.objects.all()
    serializer_class = ClinicalNoteSerializer


# Vista corregida para predicción por perfil
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def prediccion_por_perfil(request, perfilId):
    try:
        perfil = Perfil.objects.get(id=perfilId)

        # Validación: solo el dueño del perfil puede acceder
        if perfil.jefe != request.user:
            return Response({
                "detail": "No tienes permiso para acceder a este perfil."
            }, status=status.HTTP_403_FORBIDDEN)

        registros = MenstrualRecord.objects.filter(user=perfil.jefe).order_by('-fecha_ultima_menstruacion')

        if not registros.exists():
            return Response({
                "detail": "No hay registros menstruales para este perfil.",
                "prediccion": None,
                "ultimo_registro": None
            }, status=status.HTTP_404_NOT_FOUND)

        ultimo = registros.first()

        fecha_inicio_predicha = ultimo.fecha_ultima_menstruacion + timezone.timedelta(days=28)
        fecha_fin_predicha = fecha_inicio_predicha + timezone.timedelta(days=6)

        return Response({
            "prediccion": {
                "fecha_inicio": fecha_inicio_predicha.strftime('%Y-%m-%d'),
                "fecha_fin": fecha_fin_predicha.strftime('%Y-%m-%d')
            },
            "ultimo_registro": {
                "id": ultimo.id,
                "fecha_inicio": ultimo.fecha_ultima_menstruacion.strftime('%Y-%m-%d')
            }
        }, status=status.HTTP_200_OK)

    except Perfil.DoesNotExist:
        return Response({
            "detail": "Perfil no encontrado."
        }, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print("⚠️ Error en prediccion_por_perfil:", e)
        traceback.print_exc()
        return Response({
            "detail": "Error interno en el servidor.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# --- Embarazos por perfil ---
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def embarazos_por_perfil(request, perfilId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'GET':
            embarazos = Pregnancy.objects.filter(user=perfil.jefe)
            serializer = PregnancySerializer(embarazos, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            data = request.data.copy()
            data['user'] = perfil.jefe.id
            serializer = PregnancySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en embarazos_por_perfil:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def embarazo_detalle(request, perfilId, embarazoId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        embarazo = Pregnancy.objects.get(id=embarazoId, user=perfil.jefe)

        if request.method == 'GET':
            serializer = PregnancySerializer(embarazo)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = PregnancySerializer(embarazo, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            embarazo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Pregnancy.DoesNotExist:
        return Response({"detail": "Embarazo no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en embarazo_detalle:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- Checks por perfil ---
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def checks_por_perfil(request, perfilId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'GET':
            checks = PregnancyCheck.objects.filter(pregnancy__user=perfil.jefe)
            serializer = PregnancyCheckSerializer(checks, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = PregnancyCheckSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en checks_por_perfil:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def check_detalle(request, perfilId, checkId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        check = PregnancyCheck.objects.get(id=checkId, pregnancy__user=perfil.jefe)

        if request.method == 'GET':
            serializer = PregnancyCheckSerializer(check)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = PregnancyCheckSerializer(check, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            check.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except PregnancyCheck.DoesNotExist:
        return Response({"detail": "Check no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en check_detalle:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- Notas clínicas por perfil ---
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def notes_por_perfil(request, perfilId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        if request.method == 'GET':
            notes = ClinicalNote.objects.filter(pregnancy__user=perfil.jefe)
            serializer = ClinicalNoteSerializer(notes, many=True)
            return Response(serializer.data)

        elif request.method == 'POST':
            serializer = ClinicalNoteSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en notes_por_perfil:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def note_detalle(request, perfilId, noteId):
    try:
        perfil = Perfil.objects.get(id=perfilId)
        if perfil.jefe != request.user:
            return Response({"detail": "No tienes permiso para este perfil."}, status=status.HTTP_403_FORBIDDEN)

        note = ClinicalNote.objects.get(id=noteId, pregnancy__user=perfil.jefe)

        if request.method == 'GET':
            serializer = ClinicalNoteSerializer(note)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = ClinicalNoteSerializer(note, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.method == 'DELETE':
            note.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Perfil.DoesNotExist:
        return Response({"detail": "Perfil no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    except ClinicalNote.DoesNotExist:
        return Response({"detail": "Nota no encontrada."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("⚠️ Error en note_detalle:", e)
        traceback.print_exc()
        return Response({"detail": "Error interno.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)