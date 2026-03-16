from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    duration_minutes = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class Session(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='sessions')
    start_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.movie.title} - {self.start_datetime}"


class Seat(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    is_purchased = models.BooleanField(default=False)

    class Meta:
        unique_together = ('session', 'seat_number')

    def __str__(self):
        return f"{self.session} - {self.seat_number}"