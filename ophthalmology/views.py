from rest_framework import viewsets
from .models import OphthalmologyDiagnosis
from .serializers import OphthalmologyDiagnosisSerializer
from rest_framework.permissions import IsAuthenticated

class OphthalmologyDiagnosisViewSet(viewsets.ModelViewSet):
    queryset = OphthalmologyDiagnosis.objects.all()
    serializer_class = OphthalmologyDiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)
