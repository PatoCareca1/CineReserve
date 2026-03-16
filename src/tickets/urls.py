from django.urls import path
from .views import SeatReservationView, CheckoutView, MyTicketsView

urlpatterns = [
    path('reserve/', SeatReservationView.as_view(), name='seat-reserve'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('my-tickets/', MyTicketsView.as_view(), name='my-tickets'),
]