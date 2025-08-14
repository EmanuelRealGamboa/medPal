from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsDoctorOrOwnerReadOnly(BasePermission):
    """
    Lectura:
      - Dueño (patient_user), DOCTOR o ADMIN.
    Escritura (POST/PUT/PATCH/DELETE):
      - Solo DOCTOR o ADMIN.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        role = getattr(user, 'role', getattr(user, 'rol', None))  # por si tu modelo usa 'rol'
        if request.method in SAFE_METHODS:
            return (role in ('ADMIN','DOCTOR')) or (obj.patient_user_id == user.id)
        return role in ('ADMIN','DOCTOR')
