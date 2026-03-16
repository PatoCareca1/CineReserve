from django.db import models
from django.contrib.auth import get_user_model
from movies.models import Seat

User = get_user_model()

class Ticket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tickets')
    seat = models.OneToOneField(Seat, on_delete=models.CASCADE, related_name='ticket')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.seat}"