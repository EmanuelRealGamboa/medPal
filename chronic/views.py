from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import ChronicCondition
from .serializers import ChronicConditionSerializer
from .permissions import IsDoctorOrOwnerReadOnly

class ChronicConditionViewSet(viewsets.ModelViewSet):
    queryset = (
        ChronicCondition.objects
        .select_related('patient_user')
        .prefetch_related('symptoms', 'complications')
    )
    serializer_class = ChronicConditionSerializer
    permission_classes = [IsAuthenticated, IsDoctorOrOwnerReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = [
        'patient_user', 'disease_name', 'current_status',
        'is_active', 'classification_system', 'classification_level'
    ]
    search_fields = ['disease_name', 'diagnosing_institution', 'diagnosing_physician']
    ordering_fields = ['diagnosis_date', 'updated_at']
    ordering = ['-updated_at']

    def get_queryset(self):
        """El paciente solo ve sus propios registros."""
        qs = super().get_queryset()
        user = self.request.user
        role = getattr(user, 'role', getattr(user, 'rol', None))
        if role == 'PATIENT':
            return qs.filter(patient_user=user)
        return qs
