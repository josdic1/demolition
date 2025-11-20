from flask import Blueprint, jsonify, render_template
from app.extensions import db
from app.models import User, Link, Song, Genre, Status
import os

command_bp = Blueprint('command', __name__)


@command_bp.route('/command')
def command_center():
    return render_template('command.html')


@command_bp.route('/seed', methods=['POST'])
def seed():
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
        print("Creating database tables...")
        db.create_all()
        
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

        # Create user variables
        for user in users:
            var_name = user.name.lower().replace(" ", "_")
            seed_content += f'        {var_name} = User(name="{user.name}", email="{user.email}")\n'
            seed_content += f'        {var_name}.set_password("password123")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [u.name.lower().replace(" ", "_") for u in users]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        # Create status variables
        seed_content += '        print("Creating statuses...")\n'
        for status in statuses:
            var_name = status.name.lower().replace(" ", "_")
            seed_content += f'        {var_name} = Status(name="{status.name}")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [s.name.lower().replace(" ", "_") for s in statuses]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        # Create genre variables
        seed_content += '        print("Creating genres...")\n'
        for genre in genres:
            var_name = genre.name.lower().replace(" ", "_").replace("'", "").replace("-", "_")
            seed_content += f'        {var_name} = Genre(name="{genre.name}")\n'

        seed_content += '        db.session.add_all([' + ', '.join(
            [g.name.lower().replace(" ", "_").replace("'", "").replace("-", "_") for g in genres]) + '])\n'
        seed_content += '        db.session.commit()\n\n'

        # Create songs using data structure
        seed_content += '        print("Creating songs...")\n'
        seed_content += '        \n'
        seed_content += '        songs_data = [\n'
        
        for song in songs:
            # Escape special characters
            title_escaped = song.title.replace('"', '\\"')
            artist_escaped = song.artist.replace('"', '\\"')
            about_escaped = song.about.replace('"', '\\"') if song.about else ""
            
            # Build links list
            links_list = ', '.join([f'("{link.url_type}", "{link.url_link}")' for link in song.links])
            
            seed_content += f'            {{"title": "{title_escaped}", "artist": "{artist_escaped}", '
            seed_content += f'"about": "{about_escaped}", '
            seed_content += f'"key": '
            if song.key:
                seed_content += f'"{song.key}"'
            else:
                seed_content += 'None'
            seed_content += f', "links": [{links_list}]}},\n'
        
        seed_content += '        ]\n\n'

        # Create songs from data
        seed_content += '''        # Create all songs and links
        for song_data in songs_data:
            song = Song(
                title=song_data["title"],
                artist=song_data["artist"],
                about=song_data["about"],
                lyrics=None,
                bpm=None,
                key=song_data.get("key"),
                user=josh,
                genre=punk,
                status=released
            )
            db.session.add(song)
            db.session.commit()
            
            # Add links for this song
            for link_type, link_url in song_data["links"]:
                link = Link(url_type=link_type, url_link=link_url, song=song)
                db.session.add(link)
            
            db.session.commit()

        print("✅ Database seeded successfully!")
        print(f"Created {User.query.count()} users")
        print(f"Created {Status.query.count()} statuses")
        print(f"Created {Genre.query.count()} genres")
        print(f"Created {Song.query.count()} songs")
        print(f"Created {Link.query.count()} links")


if __name__ == '__main__':
    seed_database()
'''

        # Write to seed file
        seed_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'seed.py')
        with open(seed_path, 'w') as f:
            f.write(seed_content)

        return jsonify({'message': 'Seed file updated!', 'songs_exported': len(songs)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500