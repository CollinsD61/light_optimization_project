from django.db import models
from django.utils import timezone
from sensors.models import Sensor

class SensorData(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='data_points', verbose_name="Cảm biến")
    timestamp = models.DateTimeField(default=timezone.now, verbose_name="Thời điểm")
    light_value = models.FloatField(null=True, blank=True, verbose_name="Giá trị ánh sáng")
    temperature = models.FloatField(null=True, blank=True, verbose_name="Nhiệt độ (°C)")
    humidity = models.FloatField(null=True, blank=True, verbose_name="Độ ẩm (%)")

    def __str__(self):
        return f"{self.sensor.name} @ {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')} | T: {self.temperature}°C, H: {self.humidity}%"


    class Meta:
        verbose_name = "Dữ liệu cảm biến"
        verbose_name_plural = "Dữ liệu các cảm biến"
        ordering = ['-timestamp']  