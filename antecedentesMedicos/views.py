from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import (
    personalesPatologicos,
    personalesNoPatologicos,
    heredoFamiliares,
    Alergias,
    Intolerancias
)
from .serializers import (
    personalesPatologicosSerializer,
    personalesNoPatologicosSerializer,
    heredoFamiliaresSerializer,
    AlergiasSerializer,
    IntoleranciasSerializer
)

#heredoFamiliares

class heredoFamiliaresView(generics.ListCreateAPIView):
    serializer_class = heredoFamiliaresSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return heredoFamiliares.objects.filter(perfil_id=perfil_id)

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        serializer.save(perfil_id=perfil_id)

class heredoFamiliaresDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = heredoFamiliaresSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'        # campo del modelo usado para buscar
    lookup_url_kwarg = 'id'
    queryset = heredoFamiliares.objects.all()

#personalesPatologicos

class personalesPatologicosView(generics.ListCreateAPIView):
    serializer_class = personalesPatologicosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return personalesPatologicos.objects.filter(perfil_id=perfil_id)

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        serializer.save(perfil_id=perfil_id)

class personalesPatologicosDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = personalesPatologicosSerializer
    permission_classes = [IsAuthenticated]
    queryset = personalesPatologicos.objects.all()
    lookup_field = 'id'        
    lookup_url_kwarg = 'id'

#personalesNoPatologicos

class personalesNoPatologicosView(generics.ListCreateAPIView):
    serializer_class = personalesNoPatologicosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return personalesNoPatologicos.objects.filter(perfil_id=perfil_id)

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        serializer.save(perfil_id=perfil_id)

class personalesNoPatologicosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = personalesNoPatologicos.objects.all()
    lookup_field = 'id'
    serializer_class = personalesNoPatologicosSerializer

#Alergias

class AlergiasView(generics.ListCreateAPIView):
    serializer_class = AlergiasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return Alergias.objects.filter(perfil_id=perfil_id)

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        serializer.save(perfil_id=perfil_id)

class AlergiasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alergias.objects.all()
    lookup_field = 'id'
    serializer_class = AlergiasSerializer


#Intolerancias

class IntoleranciasView(generics.ListCreateAPIView):
    serializer_class = IntoleranciasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return Intolerancias.objects.filter(perfil_id=perfil_id)

    def perform_create(self, serializer):
        perfil_id = self.request.data.get('perfil')
        serializer.save(perfil_id=perfil_id)

class IntoleranciasDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = IntoleranciasSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        perfil_id = self.request.query_params.get('perfil')
        return Intolerancias.objects.filter(perfil_id=perfil_id)

