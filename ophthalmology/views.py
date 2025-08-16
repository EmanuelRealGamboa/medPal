from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import OphthalmologyDiagnosis
from .serializers import OphthalmologyDiagnosisSerializer

class OphthalmologyDiagnosisViewSet(viewsets.ModelViewSet):
    serializer_class = OphthalmologyDiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        queryset = OphthalmologyDiagnosis.objects.all()
        if perfil_id:
            queryset = queryset.filter(perfil_id=perfil_id)
        return queryset

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        if not perfil_id:
            raise ValueError("Perfil ID is required")
        serializer.save(perfil_id=perfil_id)
