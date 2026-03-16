from rest_framework import serializers

class SeatReservationSerializer(serializers.Serializer):
    seat_id = serializers.IntegerField()