from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Movie

class MovieTests(APITestCase):
    def setUp(self):
        self.movie = Movie.objects.create(
            title="Inception",
            description="Dream within a dream",
            duration_minutes=148
        )
        self.movie_list_url = reverse('movie-list')

    def test_list_movies(self):
        response = self.client.get(self.movie_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "Inception")