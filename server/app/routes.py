from flask import Blueprint, session, request, jsonify
from app.models import User, Song, Genre, Status, Link
from app.models import user_schema, song_schema, genre_schema, status_schema, link_schema
from app.models import users_schema, songs_schema, genres_schema, statuses_schema, links_schema
from app.extensions import db, bcrypt
from marshmallow import ValidationError
from app.constants import LINK_TYPES, KEY_OPTIONS
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
        user = db.session.query(User).options(
            db.joinedload(User.songs).joinedload(Song.links)
        ).filter_by(id=session['user_id']).first()
        
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

# === Login ===
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data.get('email')).first()
    if user and user.check_password(data.get('password')):
        session['user_id'] = user.id
        return jsonify(user_schema.dump(user)), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

# === Logout ===
@bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200


# ------------------------------------------------- SONG ROUTES -------------------------------------------------
# === Get Songs ===
@bp.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify(songs_schema.dump(songs))

# === Get Song by ID ===
@bp.route('/songs/<int:id>', methods=['GET'])
def get_song(id):
    song = db.session.get(Song, id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    return jsonify(song_schema.dump(song))

# === Get Song Keys ===
@bp.route('/song-keys', methods=['GET'])
def get_song_keys():
    return jsonify(KEY_OPTIONS)

# === Create Song ===
@bp.route('/songs', methods=['POST'])
def create_song():
    data = request.get_json()
    print("Received data:", data)  # ← Add this
    
    try:
        new_song = song_schema.load(data)
        db.session.add(new_song)
        db.session.commit()
        return jsonify(song_schema.dump(new_song)), 201
    except ValidationError as err:
        print("Validation error:", err.messages)  # ← Add this
        return jsonify({"errors": err.messages}), 400

# === Update Song ===
@bp.route('/songs/<int:id>', methods=['PUT', 'PATCH'])
def update_song(id):
    song = db.session.get(Song, id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    
    data = request.get_json()
    print("Received data:", data)  # What does this show?
    
    try:
        updated_song = song_schema.load(data, instance=song, partial=True)
        db.session.commit()
        return jsonify(song_schema.dump(updated_song)), 200
    except ValidationError as err:
        print("Validation error:", err.messages)  # What does this show?
        return jsonify({"errors": err.messages}), 400

# === Delete Song ===
@bp.route('/songs/<int:id>', methods=['DELETE'])
def delete_song(id):
    song = db.session.get(Song, id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted"}), 200


# ------------------------------------------------- GENRE ROUTES -------------------------------------------------
# === Get Genres ===
@bp.route('/genres', methods=['GET'])
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))

# === Get Genre by ID ===
@bp.route('/genres/<int:id>', methods=['GET'])
def get_genre(id):
    genre = db.session.get(Genre, id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404
    return jsonify(genre_schema.dump(genre))

# === Create Genre ===
@bp.route('/genres', methods=['POST'])
def create_genre():
    data = request.get_json()
    
    try:
        new_genre = genre_schema.load(data)
        db.session.add(new_genre)
        db.session.commit()
        return jsonify(genre_schema.dump(new_genre)), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Update Genre ===
@bp.route('/genres/<int:id>', methods=['PUT', 'PATCH'])
def update_genre(id):
    genre = db.session.get(Genre, id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404
    
    data = request.get_json()
    
    try:
        updated_genre = genre_schema.load(data, instance=genre, partial=True)
        db.session.commit()
        return jsonify(genre_schema.dump(updated_genre)), 200
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Delete Genre ===
@bp.route('/genres/<int:id>', methods=['DELETE'])
def delete_genre(id):
    genre = db.session.get(Genre, id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404
    
    db.session.delete(genre)
    db.session.commit()
    return jsonify({"message": "Genre deleted"}), 200


# ------------------------------------------------- STATUS ROUTES -------------------------------------------------
# === Get Statuses ===
@bp.route('/statuses', methods=['GET'])
def get_statuses():
    statuses = Status.query.all()
    return jsonify(statuses_schema.dump(statuses))

# === Get Status by ID ===
@bp.route('/statuses/<int:id>', methods=['GET'])
def get_status(id):
    status = db.session.get(Status, id)
    if not status:
        return jsonify({"error": "Status not found"}), 404
    return jsonify(status_schema.dump(status))

# === Create Status ===
@bp.route('/statuses', methods=['POST'])
def create_status():
    data = request.get_json()
    
    try:
        new_status = status_schema.load(data)
        db.session.add(new_status)
        db.session.commit()
        return jsonify(status_schema.dump(new_status)), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Update Status ===
@bp.route('/statuses/<int:id>', methods=['PUT', 'PATCH'])    
def update_status(id):    
    status = db.session.get(Status, id)
    if not status:
        return jsonify({"error": "Status not found"}), 404
    
    data = request.get_json()
    
    try:
        updated_status = status_schema.load(data, instance=status, partial=True)
        db.session.commit()
        return jsonify(status_schema.dump(updated_status)), 200
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Delete Status ===
@bp.route('/statuses/<int:id>', methods=['DELETE'])
def delete_status(id):                    
    status = db.session.get(Status, id)
    if not status:
        return jsonify({"error": "Status not found"}), 404
    
    db.session.delete(status)
    db.session.commit()
    return jsonify({"message": "Status deleted"}), 200


# ------------------------------------------------- LINK ROUTES -------------------------------------------------
# === Get Link Types ===
@bp.route('/link-types', methods=['GET'])
def get_link_types():
    return jsonify(LINK_TYPES)

# === Get Links ===
@bp.route('/links', methods=['GET'])
def get_links():
    links = Link.query.all()
    return jsonify(links_schema.dump(links))

# === Get Link by ID ===
@bp.route('/links/<int:id>', methods=['GET'])
def get_link(id):
    link = db.session.get(Link, id)
    if not link:
        return jsonify({"error": "Link not found"}), 404
    return jsonify(link_schema.dump(link))

# === Create Link  ===
@bp.route('/songs/<int:song_id>/links', methods=['POST'])
def create_link_for_song(song_id):
    song = db.session.get(Song, song_id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    
    data = request.get_json()
    data['song_id'] = song_id  # Explicitly set song_id
    
    try:
        link = link_schema.load(data)
        db.session.add(link)  # Just add directly
        db.session.commit()
        return jsonify(link_schema.dump(link)), 201
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Update Link ===
@bp.route('/links/<int:id>', methods=['PUT', 'PATCH'])    
def update_link(id):    
    link = db.session.get(Link, id)
    if not link:
        return jsonify({"error": "Link not found"}), 404
    
    data = request.get_json()
    
    try:
        updated_link = link_schema.load(data, instance=link, partial=True)
        db.session.commit()
        return jsonify(link_schema.dump(updated_link)), 200
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

# === Delete Link ===
@bp.route('/links/<int:id>', methods=['DELETE'])
def delete_link(id):                
    link = db.session.get(Link, id)
    if not link:
        return jsonify({"error": "Link not found"}), 404
    
    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "Link deleted"}), 200