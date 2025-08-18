from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import EstudioGabinete, EstudioLaboratorio, EstudioFuncional
from .serializers import (
    EstudioGabineteSerializer,
    EstudioLaboratorioSerializer,
    EstudioFuncionalSerializer
)

# Create your views here.

class EstudioGabineteViewSet(viewsets.ModelViewSet):
    queryset = EstudioGabinete.objects.all()
    serializer_class = EstudioGabineteSerializer
    permission_classes = [permissions.IsAuthenticated]


class EstudioLaboratorioViewSet(viewsets.ModelViewSet):
    queryset = EstudioLaboratorio.objects.all()
    serializer_class = EstudioLaboratorioSerializer
    permission_classes = [permissions.IsAuthenticated]


class EstudioFuncionalViewSet(viewsets.ModelViewSet):
    queryset = EstudioFuncional.objects.all()
    serializer_class = EstudioFuncionalSerializer
    permission_classes = [permissions.IsAuthenticated]