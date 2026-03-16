from django.urls import path
from .views import SeatReservationView

urlpatterns = [
    path('reserve/', SeatReservationView.as_view(), name='seat-reserve'),
]