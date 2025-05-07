from django.shortcuts import render
from rest_framework import serializers

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from sensors.models import Sensor
from sensor_data.models import SensorData
from .serializers import SensorSerializer, SensorDataSerializer
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
import logging
logger = logging.getLogger(__name__)
from sensor_data.models import SensorData
from rest_framework.permissions import AllowAny

class SensorListCreateView(generics.ListCreateAPIView):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['sensor__name', 'timestamp']
    ordering_fields = ['timestamp', 'temperature', 'humidity']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Log số lượng SensorData tìm thấy
        logger.info(f"Số lượng SensorData tìm thấy: {queryset.count()}")

        # Log dữ liệu thực tế được truy vấn
        logger.info(f"Dữ liệu SensorData được truy vấn: {list(queryset.values())}")

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SensorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

class SensorDataListCreateView(generics.ListCreateAPIView):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['sensor__name', 'timestamp']
    ordering_fields = ['timestamp', 'temperature', 'humidity']
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        print(f"Số lượng SensorData tìm thấy: {queryset.count()}")  # Thêm log
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class SensorDataRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer

class ReceiveSensorDataAPIView(generics.CreateAPIView):
    serializer_class = SensorDataSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        logger.info("ReceiveSensorDataAPIView được gọi.")  # Log khi view được gọi
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        logger.info(f"Dữ liệu sau validation: {serializer.validated_data}")  # Log dữ liệu sau validation
        try:
            self.perform_create(serializer)
            logger.info("Dữ liệu đã được ghi thành công.")
            return Response({"message": "Dữ liệu đã được ghi thành công."}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            logger.error(f"Lỗi validation: {e}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Lỗi không mong muốn trong create: {e}")
            return Response({'error': 'Lỗi server không mong muốn.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

