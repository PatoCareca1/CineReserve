from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Movie, Session
from .serializers import MovieSerializer, SessionSerializer

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