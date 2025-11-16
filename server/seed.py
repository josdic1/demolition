# seed.py
from app import create_app
from app.extensions import db
from app.models import User, Genre, Status, Song, Link

def seed_database():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Users
        u1 = User(name="Josh", email="joshuadicker@gmail.com")
        u1.set_password("1111")
        u2 = User(name="Dor", email="dor@dor.com")
        u2.set_password("1111")
        db.session.add_all([u1, u2])

        # Genres
        g1 = Genre(name="Hip-Hop")
        g2 = Genre(name="Rock")
        g3 = Genre(name="Pop")
        db.session.add_all([g1, g2, g3])

        # Statuses
        s1 = Status(name="Draft")
        s2 = Status(name="Published")
        s3 = Status(name="Archived")
        db.session.add_all([s1, s2, s3])

        db.session.flush()

        # Songs
        song1 = Song(
            title="Midnight Drive", artist="Aiden Beats", about="Late night vibes",
            bpm=92, key="Cm", lyrics="Cruising down the empty road...", 
            user=u1, genre=g1, status=s2
        )
        song2 = Song(
            title="Electric Dreams", artist="Josh Rock", about="Synth-heavy anthem",
            bpm=128, key="F#m", user=u2, genre=g2, status=s1
        )
        db.session.add_all([song1, song2])
        db.session.flush()

        # Links
        l1 = Link(url_type="YouTube", url_link="https://youtube.com/watch?v=abc123", song=song1)
        l2 = Link(url_type="Spotify", url_link="https://spotify.com/track/xyz789", song=song1)
        l3 = Link(url_type="SoundCloud", url_link="https://soundcloud.com/track/def456", song=song2)
        db.session.add_all([l1, l2, l3])

        db.session.commit()
        print("Seed complete.")