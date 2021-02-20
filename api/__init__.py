from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from api.config import Config

app = Flask(__name__, static_folder="../build", static_url_path="/")
# app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

from api import routes, models