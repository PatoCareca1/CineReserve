from django.urls import path
from .views import MovieListView, SessionListView

urlpatterns = [
    path('', MovieListView.as_view(), name='movie-list'),
    path('<int:movie_id>/sessions/', SessionListView.as_view(), name='session-list'),
]