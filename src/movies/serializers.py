from rest_framework import serializers
from .models import Movie, Session, Seat

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'movie', 'movie_title', 'start_datetime']

class SeatSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'status']

    def get_status(self, obj):
        return getattr(obj, 'dynamic_status', 'Available')