from rest_framework import viewsets, permissions
from .models import MenstrualRecord, Pregnancy, PregnancyCheck, ClinicalNote
from .serializers import (
    MenstrualRecordSerializer,
    PregnancySerializer,
    PregnancyCheckSerializer,
    ClinicalNoteSerializer,
)

class BaseGinecoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        # filtramos solo usuarias con género 'F'
        return qs.filter(user__personal_data__genero='F')

class MenstrualRecordViewSet(BaseGinecoViewSet):
    queryset = MenstrualRecord.objects.all()
    serializer_class = MenstrualRecordSerializer

class PregnancyViewSet(BaseGinecoViewSet):
    queryset = Pregnancy.objects.all()
    serializer_class = PregnancySerializer

class PregnancyCheckViewSet(BaseGinecoViewSet):
    queryset = PregnancyCheck.objects.all()
    serializer_class = PregnancyCheckSerializer

class ClinicalNoteViewSet(BaseGinecoViewSet):
    queryset = ClinicalNote.objects.all()
    serializer_class = ClinicalNoteSerializer
