# app/routes.py
from flask import Blueprint, session, request, jsonify, render_template_string
from .models_mold import User, Category, Product
from .models_mold import user_schema, users_schema, category_schema, categories_schema, product_schema, products_schema
from .extensions import db, bcrypt

bp = Blueprint('main', __name__, url_prefix='')

# -------------------------------------------------
# Routes (API)
# -------------------------------------------------




@bp.route('/')
def index():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        session['name'] = user.name
    return render_template_string('<h1>Hello, {{ name }}!</h1>', name=session.get('name', 'world'))

