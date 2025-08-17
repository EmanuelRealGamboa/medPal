from rest_framework import viewsets, permissions
from .models import MedicalPrescription
from .serializers import MedicalPrescriptionSerializer

class MedicalPrescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalPrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalPrescription.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)  # ¡Esto es lo importante!

