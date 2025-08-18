from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
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




@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def prediccion_por_perfil(request, perfilId):
    try:
        registros = MenstrualRecord.objects.filter(user__perfil__id=perfilId).order_by('-fecha_inicio')

        if not registros.exists():
            return Response({
                "detail": "No hay registros menstruales para este perfil.",
                "prediccion": None,
                "ultimo_registro": None
            }, status=status.HTTP_404_NOT_FOUND)

        ultimo = registros.first()

        fecha_inicio_predicha = ultimo.fecha_inicio + timezone.timedelta(days=28)
        fecha_fin_predicha = fecha_inicio_predicha + timezone.timedelta(days=6)

        return Response({
            "prediccion": {
                "fecha_inicio": fecha_inicio_predicha.strftime('%Y-%m-%d'),
                "fecha_fin": fecha_fin_predicha.strftime('%Y-%m-%d')
            },
            "ultimo_registro": {
                "id": ultimo.id,
                "fecha_inicio": ultimo.fecha_inicio.strftime('%Y-%m-%d'),
                "fecha_fin": ultimo.fecha_fin.strftime('%Y-%m-%d')
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print("⚠️ Error en prediccion_por_perfil:", e)
        traceback.print_exc()
        return Response({
            "detail": "Error interno en el servidor.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)