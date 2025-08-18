from rest_framework import viewsets, serializers
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import OphthalmologyDiagnosis
from .serializers import OphthalmologyDiagnosisSerializer
from accounts.models import Perfil  # Asegúrate de tener el import correcto

class OphthalmologyDiagnosisViewSet(viewsets.ModelViewSet):
    serializer_class = OphthalmologyDiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra los diagnósticos por el perfil asociado si se proporciona el parámetro 'perfil'.
        """
        perfil_id = self.request.query_params.get('perfil')
        queryset = OphthalmologyDiagnosis.objects.all()
        if perfil_id:
            queryset = queryset.filter(perfil_id=perfil_id)
        return queryset

    def perform_create(self, serializer):
        """
        Crea un nuevo diagnóstico asociándolo a un perfil específico.
        """
        perfil_id = self.request.data.get('perfil')
        if not perfil_id:
            raise serializers.ValidationError({"perfil": "Perfil ID is required"})
        
        # Convertimos ID a objeto Perfil
        perfil = get_object_or_404(Perfil, id=perfil_id)
        
        # Guardamos pasando el objeto Perfil
        serializer.save(perfil=perfil)

    def perform_update(self, serializer):
        """
        Actualiza un diagnóstico existente, asegurándose de que el perfil asociado no cambie.
        """
        perfil_id = self.request.data.get('perfil')
        if perfil_id:
            # Validamos que el perfil exista
            perfil = get_object_or_404(Perfil, id=perfil_id)
            serializer.save(perfil=perfil)
        else:
            # Si no se proporciona un perfil, simplemente actualizamos los demás campos
            serializer.save()