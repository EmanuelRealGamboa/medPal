from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.urls import resolve

class DisableCSRFForAPIMiddleware(MiddlewareMixin):
    """
    Middleware que deshabilita la verificación CSRF
    para las rutas que empiezan con /antecedentesMedicos/ o /accounts/ (o las que definas).
    Para otras rutas mantiene el CSRF activo.
    """

    def process_request(self, request):
        resolver_match = resolve(request.path_info)
        path = request.path_info

        # Lista de rutas API para saltar CSRF
        api_prefixes = [
            '/antecedentesMedicos/',
            '/accounts/',
            # Agrega aquí otras rutas API que desees
        ]

        if any(path.startswith(prefix) for prefix in api_prefixes):
            setattr(request, '_dont_enforce_csrf_checks', True)
