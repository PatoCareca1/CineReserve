from unittest.mock import patch
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from movies.models import Movie, Session, Seat
from django.utils import timezone

User = get_user_model()

class SeatReservationTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='pato', email='pato@test.com', password='password123')
        self.user2 = User.objects.create_user(username='ganso', email='ganso@test.com', password='password123')

        self.movie = Movie.objects.create(title="Test Movie", description="Test", duration_minutes=120)
        self.session = Session.objects.create(movie=self.movie, start_datetime=timezone.now())
        self.seat = Seat.objects.create(session=self.session, seat_number="A1")

        self.reserve_url = reverse('seat-reserve')

    @patch('tickets.views.redis_client')
    def test_successful_reservation(self, mock_redis):
        mock_redis.set.return_value = True

        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.reserve_url, {'seat_id': self.seat.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Seat reserved successfully for 10 minutes.")
        mock_redis.set.assert_called_once_with(f"seat_lock:{self.seat.id}", self.user1.id, nx=True, ex=600)

    def test_seat_already_purchased(self):
        self.seat.is_purchased = True
        self.seat.save()

        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.reserve_url, {'seat_id': self.seat.id})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Seat is already purchased.")

    @patch('tickets.views.redis_client')
    def test_seat_reserved_by_another_user(self, mock_redis):
        mock_redis.set.return_value = False
        mock_redis.get.return_value = str(self.user2.id).encode('utf-8')

        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.reserve_url, {'seat_id': self.seat.id})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Seat is currently reserved by another user.")