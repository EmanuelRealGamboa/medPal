# views.py
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import ChronicCondition
from .serializers import ChronicConditionSerializer
from .permissions import IsDoctorOrOwnerReadOnly  # tu permiso personalizado

class ChronicConditionViewSet(viewsets.ModelViewSet):
    serializer_class = ChronicConditionSerializer
    permission_classes = [IsAuthenticated, IsDoctorOrOwnerReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'perfil', 'disease_name', 'current_status',
        'is_active', 'classification_system', 'classification_level'
    ]
    search_fields = ['disease_name', 'diagnosing_institution', 'diagnosing_physician']
    ordering_fields = ['diagnosis_date', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        """El usuario solo ve los registros de sus perfiles."""
        qs = ChronicCondition.objects.select_related('perfil').prefetch_related('symptoms', 'complications')
        user = self.request.user
        role = getattr(user, 'role', getattr(user, 'rol', None))

        # Si es paciente, filtra por perfiles que pertenecen a él
        if role == 'PATIENT':
            return qs.filter(perfil__jefe=user)
        return qs
