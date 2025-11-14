from .extensions import db, ma, bcrypt

# -------------------------------------------------
# Model
# -------------------------------------------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    

class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)


class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_type = db.Column(db.String(255), nullable=False)
    url_link = db.Column(db.String(255), nullable=False)


class Status(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)


class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    artist = db.Column(db.String(200), nullable=False)
    about = db.Column(db.Text, nullable=True)
    bpm = db.Column(db.Integer, nullable=True)
    key = db.Column(db.String(10), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.id'), nullable=True)
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=True)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'), nullable=True)
    creeated_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())










    
