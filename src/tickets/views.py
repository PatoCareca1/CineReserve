import redis
from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import views, status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from movies.models import Seat
from .models import Ticket
from .serializers import SeatReservationSerializer, TicketSerializer
from .tasks import send_ticket_confirmation

redis_client = redis.from_url(settings.REDIS_URL)

class SeatReservationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SeatReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        seat_id = serializer.validated_data['seat_id']

        seat = get_object_or_404(Seat, id=seat_id)

        if seat.is_purchased:
            return Response(
                {"detail": "Seat is already purchased."},
                status=status.HTTP_400_BAD_REQUEST
            )

        lock_key = f"seat_lock:{seat.id}"
        lock_acquired = redis_client.set(lock_key, request.user.id, nx=True, ex=600)

        if not lock_acquired:
            lock_owner = redis_client.get(lock_key)
            if lock_owner and int(lock_owner) == request.user.id:
                return Response(
                    {"detail": "You already have a lock on this seat."},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"detail": "Seat is currently reserved by another user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Seat reserved successfully for 10 minutes."},
            status=status.HTTP_200_OK
        )

class CheckoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SeatReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        seat_id = serializer.validated_data['seat_id']

        lock_key = f"seat_lock:{seat_id}"
        lock_owner = redis_client.get(lock_key)

        if not lock_owner or int(lock_owner) != request.user.id:
            return Response(
                {"detail": "You do not have a valid reservation for this seat."},
                status=status.HTTP_400_BAD_REQUEST
            )

        seat = get_object_or_404(Seat, id=seat_id)

        try:
            with transaction.atomic():
                seat.is_purchased = True
                seat.save()
                
                ticket = Ticket.objects.create(
                    user=request.user,
                    seat=seat
                )

            redis_client.delete(lock_key)
            
            send_ticket_confirmation.delay(ticket.id)
            
            return Response(
                {"detail": "Ticket purchased successfully.", "ticket_id": ticket.id},
                status=status.HTTP_201_CREATED
            )
        except Exception:
            return Response(
                {"detail": "An error occurred during checkout."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MyTicketsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-created_at')