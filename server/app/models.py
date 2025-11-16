from .extensions import db, ma, bcrypt

# -------------------------------------------------
# Model
# -------------------------------------------------

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    # User has many songs
    songs = db.relationship('Song', back_populates='user', cascade='all, delete-orphan')
    
    # User has many genres THROUGH songs (many-to-many via Song table)
    genres = db.relationship('Genre', 
                            secondary='song',  # Song is the join table!
                            back_populates='users',
                            viewonly=True)
    
    # User has many statuses THROUGH songs (many-to-many via Song table)
    statuses = db.relationship('Status',
                              secondary='song',  # Song is the join table!
                              back_populates='users',
                              viewonly=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Genre(db.Model):
    __tablename__ = 'genre'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Genre has many songs
    songs = db.relationship('Song', back_populates='genre')
    
    # Genre has many users THROUGH songs
    users = db.relationship('User',
                           secondary='song',
                           back_populates='genres',
                           viewonly=True)


class Status(db.Model):
    __tablename__ = 'status'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # Status has many songs
    songs = db.relationship('Song', back_populates='status')
    
    # Status has many users THROUGH songs
    users = db.relationship('User',
                           secondary='song',
                           back_populates='statuses',
                           viewonly=True)


class Song(db.Model):
    __tablename__ = 'song'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist = db.Column(db.String(200), nullable=False)
    about = db.Column(db.Text, nullable=True)
    bpm = db.Column(db.Integer, nullable=True)
    key = db.Column(db.String(10), nullable=True)
    lyrics = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())
    
    # Song belongs to user, genre, status
    user = db.relationship('User', back_populates='songs')
    genre = db.relationship('Genre', back_populates='songs')
    status = db.relationship('Status', back_populates='songs')
    
    # Song has many links
    links = db.relationship('Link', back_populates='song', cascade='all, delete-orphan')


class Link(db.Model):
    __tablename__ = 'link'
    id = db.Column(db.Integer, primary_key=True)
    url_type = db.Column(db.String(255), nullable=False)
    url_link = db.Column(db.String(255), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)
    
    # Link belongs to song
    song = db.relationship('Song', back_populates='links')

# -------------------------------------------------

# -------------------------------------------------
# Schemas
# -------------------------------------------------


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        load_instance = True
    
    id = ma.auto_field(dump_only=True)
    name = ma.auto_field()

class StatusSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Status
        load_instance = True
    
    id = ma.auto_field(dump_only=True)
    name = ma.auto_field()

class LinkSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Link
        load_instance = True
        exclude = ['song_id']  # Don't need FK
    
    id = ma.auto_field(dump_only=True)
    url_type = ma.auto_field()
    url_link = ma.auto_field()

class SongSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Song
        load_instance = True
        exclude = ['user_id', 'genre_id', 'status_id']
    
    id = ma.auto_field(dump_only=True)
    title = ma.auto_field()
    artist = ma.auto_field()
    about = ma.auto_field()
    lyrics = ma.auto_field()
    bpm = ma.auto_field()
    key = ma.auto_field()
    created_at = ma.auto_field(dump_only=True)
    updated_at = ma.auto_field(dump_only=True)
    
    user = ma.Nested('UserSchema', only=['id', 'name', 'email'])  # Add this
    genre = ma.Nested(GenreSchema, only=['id', 'name'])
    status = ma.Nested(StatusSchema, only=['id', 'name'])
    links = ma.Nested(LinkSchema, many=True)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ['password_hash']
    
    id = ma.auto_field(dump_only=True)
    name = ma.auto_field()
    email = ma.auto_field()
    songs = ma.Nested('SongSchema', many=True, exclude=['user']) 

# Schema instances
user_schema = UserSchema()
users_schema = UserSchema(many=True)
song_schema = SongSchema()
songs_schema = SongSchema(many=True)
genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)
status_schema = StatusSchema()
statuses_schema = StatusSchema(many=True)
link_schema = LinkSchema()
links_schema = LinkSchema(many=True)