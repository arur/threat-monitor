from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/data/', views.ajax_threats, name='ajax'),
]