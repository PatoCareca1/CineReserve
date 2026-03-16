from django.urls import path
from .views import SeatReservationView, CheckoutView

urlpatterns = [
    path('reserve/', SeatReservationView.as_view(), name='seat-reserve'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]