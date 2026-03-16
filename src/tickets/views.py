import redis
from django.conf import settings
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from movies.models import Seat
from .serializers import SeatReservationSerializer

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