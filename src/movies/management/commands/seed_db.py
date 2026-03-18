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

        m1 = Movie.objects.create(id=1, title='Matrix Resurrections (Pato Version)', description='Sci-Fi / Ação - Escolha a pílula vermelha.', duration_minutes=148)
        m2 = Movie.objects.create(id=2, title='Sua Melhor Escolha', description='Drama / Tecnologia - A jornada do Desenvolvedor Backend.', duration_minutes=120)
        m3 = Movie.objects.create(id=3, title='Dune: O Domador do Deserto', description='Epic Sci-Fi - Aquele que controla a API, controla o universo.', duration_minutes=166)
        m4 = Movie.objects.create(id=4, title='Erro 500: A Maldição do Código', description='Terror - Eles acharam que estava pronto para produção...', duration_minutes=95)
        m5 = Movie.objects.create(id=5, title='Em Busca do Deploy Perfeito', description='Sci-Fi Espacial - Onde nenhum dev jamais esteve.', duration_minutes=150)
        m6 = Movie.objects.create(id=6, title='O Poderoso Tech Lead', description='Drama / Máfia - Vou fazer uma PR que ele não pode recusar.', duration_minutes=175)

        agora = timezone.now() + datetime.timedelta(hours=2)
        movies = [m1, m2, m3, m4, m5, m6]
        
        sessions = []
        for movie in movies:
            sessions.append(Session.objects.create(movie=movie, start_datetime=agora))

        for session in sessions:
            for row in ['A', 'B', 'C', 'D', 'E']:
                for col in range(1, 6):
                    Seat.objects.create(session=session, seat_number=f'{row}{col}')

        Seat.objects.filter(session=sessions[0], seat_number__in=['A1', 'B2', 'D4', 'E5']).update(is_purchased=True)

        self.stdout.write(self.style.SUCCESS('Banco de dados populado com sucesso com os 6 filmes épicos!'))