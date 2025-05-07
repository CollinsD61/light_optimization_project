from django.db import models

class Sensor(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Tên cảm biến")
    description = models.TextField(blank=True, null=True, verbose_name="Mô tả")
    location = models.CharField(max_length=200, blank=True, null=True, verbose_name="Vị trí")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Thời điểm tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Thời điểm cập nhật")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Cảm biến"
        verbose_name_plural = "Các cảm biến"
