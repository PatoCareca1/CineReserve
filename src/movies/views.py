import redis
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Movie, Session, Seat
from .serializers import MovieSerializer, SessionSerializer, SeatSerializer

redis_client = redis.from_url(settings.REDIS_URL)

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all().order_by('id')
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

class SessionListView(generics.ListAPIView):
    serializer_class = SessionSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        movie_id = self.kwargs.get('movie_id')
        return Session.objects.filter(movie_id=movie_id).order_by('start_datetime')

class SessionSeatListView(generics.ListAPIView):
    serializer_class = SeatSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        session_id = self.kwargs.get('session_id')
        return Seat.objects.filter(session_id=session_id).order_by('seat_number')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response([])

        seat_keys = [f"seat_lock:{seat.id}" for seat in queryset]
        locked_seats_status = redis_client.mget(seat_keys)

        for seat, lock_status in zip(queryset, locked_seats_status):
            if seat.is_purchased:
                seat.dynamic_status = 'Purchased'
            elif lock_status:
                seat.dynamic_status = 'Reserved'
            else:
                seat.dynamic_status = 'Available'

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)