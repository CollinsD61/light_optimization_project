from rest_framework import serializers
from sensors.models import Sensor
from sensor_data.models import SensorData


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

class SensorDataSerializer(serializers.ModelSerializer):
    sensor_name = serializers.CharField(write_only=True)

    class Meta:
        model = SensorData
        fields = ['id', 'timestamp', 'light_value', 'temperature', 'humidity', 'sensor', 'sensor_name']
        read_only_fields = ['id', 'timestamp', 'sensor']

    def create(self, validated_data):
        sensor_name = validated_data.pop('sensor_name')
        sensor, created = Sensor.objects.get_or_create(name=sensor_name)
        return SensorData.objects.create(sensor=sensor, **validated_data)
        '''try:
            sensor = Sensor.objects.get(name=sensor_name)
        except Sensor.DoesNotExist:
            raise serializers.ValidationError({'sensor_name': 'Cảm biến không tồn tại.'})
        return SensorData.objects.create(sensor=sensor, **validated_data)'''
