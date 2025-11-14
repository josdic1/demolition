from flask import Flask
from app.extensions import db, migrate, bcrypt, cors
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)

    from server.app import routes_mold
    
    return app