from django.urls import path
from .views import (
    SensorListCreateView,
    SensorRetrieveUpdateDestroyView,
    SensorDataListCreateView,
    SensorDataRetrieveUpdateDestroyView,
    ReceiveSensorDataAPIView,
)

urlpatterns = [
    path('sensors/', SensorListCreateView.as_view(), name='sensor-list-create'),
    path('sensors/<int:pk>/', SensorRetrieveUpdateDestroyView.as_view(), name='sensor-retrieve-update-destroy'),
    path('sensor-data/', SensorDataListCreateView.as_view(), name='sensor-data-list-create'),
    path('sensor-data/<int:pk>/', SensorDataRetrieveUpdateDestroyView.as_view(), name='sensor-data-retrieve-update-destroy'),
    path('receive-data/', ReceiveSensorDataAPIView.as_view(), name='receive-sensor-data'),
]