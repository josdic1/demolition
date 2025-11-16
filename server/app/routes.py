from flask import Blueprint, session, request, jsonify
from app.models import User, Song, Genre, Status, Link
from app.models import user_schema, song_schema, genre_schema, status_schema, link_schema
from app.models import users_schema, songs_schema, genres_schema, statuses_schema, links_schema
from app.extensions import db, bcrypt

bp = Blueprint('main', __name__, url_prefix='')

# -------------------------------------------------
# Routes (API)
# -------------------------------------------------

@bp.route('/check_session')
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({
            "logged_in": True,
            "user": user_schema.dump(user)
        })
    return jsonify({"logged_in": False})


@bp.route('/')
def index():
    return jsonify({"message": "Demolition API"})


@bp.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify(songs_schema.dump(songs))


@bp.route('/songs/<int:id>', methods=['GET'])
def get_song(id):
    song = Song.query.get_or_404(id)
    return jsonify(song_schema.dump(song))


@bp.route('/genres', methods=['GET'])
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@bp.route('/statuses', methods=['GET'])
def get_statuses():
    statuses = Status.query.all()
    return jsonify(statuses_schema.dump(statuses))