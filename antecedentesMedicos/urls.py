from django.urls import path
from .views import (
    heredoFamiliaresView, heredoFamiliaresDetailView,
    personalesPatologicosView, personalesPatologicosDetailView,
    personalesNoPatologicosView, personalesNoPatologicosDetailView,
    AlergiasView, AlergiasDetailView,
    IntoleranciasView, IntoleranciasDetailView
)

urlpatterns = [
    path('heredoFamiliares/', heredoFamiliaresView.as_view()),
    path('heredoFamiliares/<int:id>/', heredoFamiliaresDetailView.as_view()),
    path('personalesPatologicos/', personalesPatologicosView.as_view()),
    path('personalesPatologicos/<int:id>/', personalesPatologicosDetailView.as_view()),
    path('personalesNoPatologicos/', personalesNoPatologicosView.as_view()),
    path('personalesNoPatologicos/<int:id>/', personalesNoPatologicosDetailView.as_view()),
    path('Alergias/', AlergiasView.as_view()),
    path('Alergias/<int:id>/', AlergiasDetailView.as_view()),
    path('Intolerancias/', IntoleranciasView.as_view()),
    path('Intolerancias/<int:pk>/', IntoleranciasDetailView.as_view()),
]
