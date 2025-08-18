from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsDoctorOrOwnerReadOnly(BasePermission):
    """
    Lectura:
      - Dueño (jefe del perfil), DOCTOR o ADMIN.
    Escritura:
      - Dueño (jefe del perfil), DOCTOR o ADMIN.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        role = getattr(user, 'role', getattr(user, 'rol', None))

        # Lectura
        if request.method in SAFE_METHODS:
            return (role in ('ADMIN','DOCTOR')) or (obj.perfil.jefe.id == user.id)

        # Escritura
        return (role in ('ADMIN','DOCTOR')) or (obj.perfil.jefe.id == user.id)
