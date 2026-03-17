import time
from celery import shared_task
from django.contrib.auth import get_user_model
from .models import Ticket

User = get_user_model()

@shared_task
def send_ticket_confirmation(ticket_id):
    try:
        ticket = Ticket.objects.get(id=ticket_id)
        time.sleep(3)
        print(f"E-mail enviado com sucesso para {ticket.user.email} - Assento: {ticket.seat.seat_number}")
        return True
    except Ticket.DoesNotExist:
        return False