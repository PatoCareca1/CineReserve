import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from movies.models import Movie, Session, Seat

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados iniciais para avaliacao de portfolio'

    def handle(self, *args, **kwargs):
        Seat.objects.all().delete()
        Session.objects.all().delete()
        Movie.objects.all().delete()

        m1 = Movie.objects.create(title='Matrix Resurrections (Pato Version)', description='Sci-Fi / Ação', duration_minutes=148)
        m2 = Movie.objects.create(title='Sua Melhor Escolha', description='Drama / Tecnologia', duration_minutes=120)
        m3 = Movie.objects.create(title='Dune: Part Two (Pato on Sandworm)', description='Epic Sci-Fi', duration_minutes=166)
        m4 = Movie.objects.create(title='O Rei Leão do Desenvolvimento', description='Animação / Meta-humor', duration_minutes=90)

        agora = timezone.now() + datetime.timedelta(hours=2)
        s1 = Session.objects.create(movie=m1, start_datetime=agora)
        s2 = Session.objects.create(movie=m2, start_datetime=agora)
        s3 = Session.objects.create(movie=m3, start_datetime=agora)
        s4 = Session.objects.create(movie=m4, start_datetime=agora)

        for session in [s1, s2, s3, s4]:
            for row in ['A', 'B', 'C', 'D', 'E']:
                for col in range(1, 6):
                    Seat.objects.create(session=session, seat_number=f'{row}{col}')

        Seat.objects.filter(session=s1, seat_number__in=['A1', 'C3', 'E5']).update(is_purchased=True)

        self.stdout.write(self.style.SUCCESS('Banco de dados populado com sucesso com os filmes customizados!'))