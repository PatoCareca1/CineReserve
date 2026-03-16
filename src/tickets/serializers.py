from rest_framework import serializers
from .models import Ticket
from movies.serializers import SeatSerializer

class TicketSerializer(serializers.ModelSerializer):
    seat = SeatSerializer(read_only=True)
    movie_title = serializers.CharField(source='seat.session.movie.title', read_only=True)
    session_time = serializers.DateTimeField(source='seat.session.start_datetime', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'movie_title', 'session_time', 'seat']

class SeatReservationSerializer(serializers.Serializer):
    seat_id = serializers.IntegerField()