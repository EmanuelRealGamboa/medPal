from django.shortcuts import render
from rest_framework import generics

# Create your views here.

from. models import (
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

#personalesPatologicos

class personalesPatologicosView(generics.ListCreateAPIView):
    queryset = personalesPatologicos.objects.all()
    serializer_class = personalesPatologicosSerializer

class personalesPatologicosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = personalesPatologicos.objects.all()
    lookup_url_kwarg = 'personalesPatologicos_id'
    serializer_class = personalesPatologicosSerializer

#personalesNoPatologicos

class personalesNoPatologicosView(generics.ListCreateAPIView):
    queryset = personalesNoPatologicos.objects.all()
    serializer_class = personalesNoPatologicosSerializer

class personalesNoPatologicosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = personalesNoPatologicos.objects.all()
    lookup_field = 'id'
    serializer_class = personalesNoPatologicosSerializer

#heredoFamiliares

class heredoFamiliaresView(generics.ListCreateAPIView):
    queryset = heredoFamiliares.objects.all()
    serializer_class = heredoFamiliaresSerializer

class heredoFamiliaresDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = heredoFamiliares.objects.all()
    lookup_field = 'id'
    serializer_class = heredoFamiliaresSerializer

#Alergias

class AlergiasView(generics.ListCreateAPIView):
    queryset = Alergias.objects.all()
    serializer_class = AlergiasSerializer

class AlergiasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alergias.objects.all()
    lookup_field = 'id'
    serializer_class = AlergiasSerializer


#Intolerancias

class IntoleranciasView(generics.ListCreateAPIView):
    queryset = Intolerancias.objects.all()
    serializer_class = IntoleranciasSerializer

class IntoleranciasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Intolerancias.objects.all()
    lookup_field = 'id'
    serializer_class = IntoleranciasSerializer

