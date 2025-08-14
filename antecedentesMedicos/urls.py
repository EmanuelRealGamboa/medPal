from django.urls import path 

from . import views


urlpatterns = [


    #rutas personalesPatologicos 
    path('personalesPatologicos/', views.personalesPatologicosView.as_view()),
    path('personalesPatologicos/<int:personalesPatologicos_id>', views.personalesPatologicosDetailView.as_view()),
    
    #rutas personalesNoPatologicos 
    path('personalesNoPatologicos/', views.personalesNoPatologicosView.as_view()),
    path('personalesNoPatologicos/<int:id>/', views.personalesNoPatologicosDetailView.as_view()),


    #rutas #heredoFamiliares
 
    path('heredoFamiliares/', views.heredoFamiliaresView.as_view()),
    path('heredoFamiliares/<int:id>/', views.heredoFamiliaresDetailView.as_view()),


    #rutas Alergias 
    path('Alergias/', views.AlergiasView.as_view()),
    path('Alergias/<int:id>/', views.AlergiasDetailView.as_view()),



    #rutas Alergias 
    path('Intolerancias/', views.IntoleranciasView.as_view()),
    path('Intolerancias/<int:id>/', views.IntoleranciasDetailView.as_view()),






]
 