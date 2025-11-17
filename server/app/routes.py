from flask import Blueprint, session, request, jsonify
from app.models import User, Song, Genre, Status, Link
from app.models import user_schema, song_schema, genre_schema, status_schema, link_schema
from app.models import users_schema, songs_schema, genres_schema, statuses_schema, links_schema
from app.extensions import db, bcrypt

bp = Blueprint('main', __name__, url_prefix='')

# -------------------------------------------------
# Routes (API)
# -------------------------------------------------
@bp.route('/')
def index():
    return jsonify({"message": "Demolition API"})

@bp.route('/check_session')
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({
            "logged_in": True,
            "user": user_schema.dump(user)
        })
    return jsonify({"logged_in": False})

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    # Check if user exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    new_user = User(email=email, name=name)
    new_user.set_password(password)  # The set_password method I defined in the User model
    
    db.session.add(new_user)
    db.session.commit()
    
    # Auto-login
    session['user_id'] = new_user.id # Put user id in session to log them in manually
    
    return jsonify({
        "message": "Signup successful",
        "user": user_schema.dump(new_user)
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email & password required"}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):  # check_password method from User model
        session['user_id'] = user.id
        session['name'] = user.name
        
        return jsonify(user_schema.dump(user)), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200


@bp.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify(songs_schema.dump(songs))


@bp.route('/songs/<int:id>', methods=['GET'])
def get_song(id):
    song = Song.query.get_or_404(id)
    return jsonify(song_schema.dump(song))

@bp.route('/songs/<int:id>', methods=['DELETE'])
def delete_song(id):
    song = db.session.get(Song, id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted"}), 200


@bp.route('/genres', methods=['GET'])
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@bp.route('/statuses', methods=['GET'])
def get_statuses():
    statuses = Status.query.all()
    return jsonify(statuses_schema.dump(statuses))