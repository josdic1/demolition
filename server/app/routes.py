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
    song = Song.query.get_or_404(id)
    return jsonify(song_schema.dump(song))

# === Create Song ===
@bp.route('/songs', methods=['POST'])
def create_song():
    data = request.get_json()
    new_song = Song(**data)

    ### Alternatively, you can unpack the data dictionary directly: ###
    # title = data.get('title')
    # artist = data.get('artist')
    # about = data.get('about')
    # bpm = data.get('bpm')
    # key = data.get('key')
    # lyrics = data.get('lyrics')
    # user_id = data.get('user_id')
    # genre_id = data.get('genre_id')
    # status_id = data.get('status_id')
    
    # new_song = Song(title=title, artist=artist, about=about, bpm=bpm, key=key, lyrics=lyrics, user_id=user_id, genre_id=genre_id, status_id=status_id)
    
    db.session.add(new_song)
    db.session.commit()
    
    return jsonify(song_schema.dump(new_song)), 201

# === Update Song ===
@bp.route('/songs/<int:id>', methods=['PUT', 'PATCH'])
def update_song(id):
    song = db.session.get(Song, id)
    if not song:
        return jsonify({"error": "Song not found"}), 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(song, key, value)

    ### Alternatively, update fields manually ###
    # if 'title' in data:
    #     song.title = data['title']
    # if 'artist' in data:
    #     song.artist = data['artist']
    # if 'about' in data:
    #     song.about = data['about']
    # if 'bpm' in data:
    #     song.bpm = data['bpm']
    # if 'key' in data:
    #     song.key = data['key']
    # if 'lyrics' in data:
    #     song.lyrics = data['lyrics']
    # if 'genre_id' in data:
    #     song.genre_id = data['genre_id']
    # if 'status_id' in data:
    #     song.status_id = data['status_id']
    

    db.session.commit()
    return jsonify(song_schema.dump(song)), 200

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
    genre = Genre.query.get_or_404(id)
    return jsonify(genre_schema.dump(genre))

# === Create Genre ===
@bp.route('/genres', methods=['POST'])
def create_genre():
    data = request.get_json()
    new_genre = Genre(**data)
    
    db.session.add(new_genre)
    db.session.commit()
    
    return jsonify(genre_schema.dump(new_genre)), 201

# === Update Genre ===
@bp.route('/genres/<int:id>', methods=['PUT', 'PATCH'])
def update_genre(id):
    genre = db.session.get(Genre, id)
    if not genre:
        return jsonify({"error": "Genre not found"}), 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(genre, key, value)
    
    db.session.commit()
    return jsonify(genre_schema.dump(genre)), 200

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
    status = Status.query.get_or_404(id)
    return jsonify(status_schema.dump(status))

# === Create Status ===
@bp.route('/statuses', methods=['POST'])
def create_status():
    data = request.get_json()
    new_status = Status(**data)
    
    db.session.add(new_status)
    db.session.commit()
    
    return jsonify(status_schema.dump(new_status)), 201

# === Update Status ===
@bp.route('/statuses/<int:id>', methods=['PUT', 'PATCH'])    
def update_status(id):    
    status = db.session.get(Status, id)
    if not status:
        return jsonify({"error": "Status not found"}), 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(status, key, value)
    
    db.session.commit()
    return jsonify(status_schema.dump(status)), 200

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
# === Get Links ===
@bp.route('/links', methods=['GET'])
def get_links():
    links = Link.query.all()
    return jsonify(links_schema.dump(links))


# === Get Link by ID ===
@bp.route('/links/<int:id>', methods=['GET'])
def get_link(id):
    link = Link.query.get_or_404(id)
    return jsonify(link_schema.dump(link))

# === Create Link ===
@bp.route('/links', methods=['POST'])
def create_link():    
    data = request.get_json()
    new_link = Link(**data)
    
    db.session.add(new_link)
    db.session.commit()
    
    return jsonify(link_schema.dump(new_link)), 201

# === Update Link ===
@bp.route('/links/<int:id>', methods=['PUT', 'PATCH'])    
def update_link(id):    
    link = db.session.get(Link, id)
    if not link:
        return jsonify({"error": "Link not found"}), 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(link, key, value)
    
    db.session.commit()
    return jsonify(link_schema.dump(link)), 200

# === Delete Link ===
@bp.route('/links/<int:id>', methods=['DELETE'])
def delete_link(id):                
    link = db.session.get(Link, id)
    if not link:
        return jsonify({"error": "Link not found"}), 404
    
    db.session.delete(link)
    db.session.commit()
    return jsonify({"message": "Link deleted"}), 200    