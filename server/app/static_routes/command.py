from flask import Blueprint, jsonify, render_template
from app.extensions import db
from app.models import User, Link, Song, Genre, Status
from app.models import user_schema, users_schema, link_schema, links_schema
from app.models import song_schema, songs_schema, genre_schema, genres_schema
from app.models import status_schema, statuses_schema
import os

command_bp = Blueprint('command', __name__)


@command_bp.route('/command')
def command_center():
    return render_template('command.html')


@command_bp.route('/seed', methods=['POST'])
def seed_database():
    from seed import seed_database
    try:
        seed_database()
        return jsonify({'message': 'Database seeded successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@command_bp.route('/nuke', methods=['POST'])
def nuke_database():
    try:
        Link.query.delete()
        Song.query.delete()
        Genre.query.delete()
        Status.query.delete()
        User.query.delete()
        db.session.commit()
        return jsonify({'message': 'All data cleared! Tables still exist.'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@command_bp.route('/remove-db', methods=['POST'])
def remove_database():
    try:
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'instance', 'app.db')
        if os.path.exists(db_path):
            os.remove(db_path)
            return jsonify({'message': 'Database file deleted! Run flask db upgrade to recreate.'})
        else:
            return jsonify({'message': 'Database file does not exist.'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@command_bp.route('/update-seed', methods=['POST'])
def update_seed_file():
    try:
        users = User.query.all()
        statuses = Status.query.all()
        genres = Genre.query.all()
        songs = Song.query.all()

        seed_content = '''from app import create_app
from app.extensions import db
from app.models import User, Status, Genre, Song, Link

def seed_database():
    app = create_app()
    with app.app_context():
        print("Clearing database...")
        try:
            Link.query.delete()
            Song.query.delete()
            Genre.query.delete()
            Status.query.delete()
            User.query.delete()
            db.session.commit()
        except Exception as e:
            print(f"Error clearing: {e}")
            db.session.rollback()

        print("Creating users...")
'''

        for user in users:
            var_name = user.name.lower().replace(" ", "_")
            seed_content += f'        {var_name} = User(name="{user.name}", email="{user.email}")\n'
            seed_content += f'        {var_name}.set_password("password123")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [u.name.lower().replace(" ", "_") for u in users]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        seed_content += '        print("Creating statuses...")\n'
        for status in statuses:
            var_name = status.name.lower().replace(" ", "_")
            seed_content += f'        {var_name} = Status(name="{status.name}")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [s.name.lower().replace(" ", "_") for s in statuses]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        seed_content += '        print("Creating genres...")\n'
        for genre in genres:
            var_name = genre.name.lower().replace(" ", "_").replace("'", "").replace("-", "_")
            seed_content += f'        {var_name} = Genre(name="{genre.name}")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [g.name.lower().replace(" ", "_").replace("'", "").replace("-", "_") for g in genres]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        seed_content += '        print("Creating songs...")\n'
        for i, song in enumerate(songs, 1):
            lyrics_escaped = song.lyrics.replace('"', '\\"').replace('\n', '\\n') if song.lyrics else ""
            user_var = song.user.name.lower().replace(" ", "_")
            genre_var = song.genre.name.lower().replace(" ", "_").replace("'", "").replace("-", "_")
            status_var = song.status.name.lower().replace(" ", "_")
            
            seed_content += f'''        song{i} = Song(
            title="{song.title}",
            artist="{song.artist}",
            about="{song.about if song.about else ''}",
            lyrics="""{lyrics_escaped}""",
            bpm={song.bpm if song.bpm else "None"},
            key="{song.key}" if {song.key is not None} else None,
            user={user_var},
            genre={genre_var},
            status={status_var}
        )
        db.session.add(song{i})
        db.session.commit()

'''
            for link in song.links:
                seed_content += f'        link{i}_{link.id} = Link(url_type="{link.url_type}", url_link="{link.url_link}", song=song{i})\n'
                seed_content += f'        db.session.add(link{i}_{link.id})\n'

            seed_content += '        db.session.commit()\n\n'

        seed_content += '''        print("✅ Database seeded successfully!")
        print(f"Created {User.query.count()} users")
        print(f"Created {Status.query.count()} statuses")
        print(f"Created {Genre.query.count()} genres")
        print(f"Created {Song.query.count()} songs")


if __name__ == '__main__':
    seed_database()
'''

        seed_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'seed.py')
        with open(seed_path, 'w') as f:
            f.write(seed_content)

        return jsonify({'message': 'Seed file updated!', 'songs_exported': len(songs)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500