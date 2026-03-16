from django.urls import path
from .views import MovieListView, SessionListView, SessionSeatListView

urlpatterns = [
    path('', MovieListView.as_view(), name='movie-list'),
    path('<int:movie_id>/sessions/', SessionListView.as_view(), name='session-list'),
    path('sessions/<int:session_id>/seats/', SessionSeatListView.as_view(), name='seat-list'),
]