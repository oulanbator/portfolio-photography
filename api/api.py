import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

# MODELS

galleryImages = db.Table('galleryImages',
    db.Column('galleryId', db.Integer, db.ForeignKey('gallery.id'), primary_key=True),
    db.Column('imageId', db.Integer, db.ForeignKey('image.id'), primary_key=True)
)

class Image(db.Model):
    __tablename__ = 'image'
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String, unique=True, nullable=False)
    title = db.Column(db.String)

class Gallery(db.Model):
    __tablename__ = 'gallery'
    id = db.Column(db.Integer, primary_key=True)
    firstImage = db.Column(db.String, unique=True, nullable=False)
    title = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    images = db.relationship('Image', secondary=galleryImages, lazy='dynamic',
        backref=db.backref('galleries', lazy='dynamic'))
    
    def add_image(self, image):
        if not self.is_used(image):
            self.images.append(image)

    def del_image(self, image):
        if self.is_used(image):
            self.images.remove(image)

    def is_used(self, image):
        return self.images.filter(
            galleryImages.c.imageId == image.id).count() > 0

# SOURCES = [
#   {"title": "Image 1", "src": "images/img-1.jpg"},
#   {"title": "Image 2", "src": "images/img-2.jpg"},
#   {"title": "Image 3", "src": "images/img-3.jpg"},
#   {"title": "Image 4", "src": "images/img-4.jpg"},
#   {"title": "Image 5", "src": "images/img-5.jpg"},
#   {"title": "Image 6", "src": "images/img-6.jpg"},
#   {"title": "Image 7", "src": "images/img-7.jpg"},
#   {"title": "Image 8", "src": "images/img-8.jpg"},
#   {"title": "Image 9", "src": "images/img-9.jpg"},
#   {"title": "Image 10", "src": "images/img-10.png"}
# ]
    
# sources_js = json.dumps(SOURCES)

def inject_sources(SOURCES):
    for line in SOURCES:
        img = Image(title=line.get("title"), source=line.get("src"))
        db.session.add(img)
        db.session.commit()

def get_gallery_sources(galleryName):
    dbGallery = Gallery.query.filter_by(title=galleryName).first()
    dbSources = []
    for img in dbGallery.images:
        title = img.title
        src = img.source
        imgDict = {"title": title, "src": src}
        dbSources.append(imgDict)
    return dbSources


@app.route('/gallery/<name>')
def get_current_time(name):
    sources = get_gallery_sources('Mariages')
    sources_js = json.dumps(sources)
    return sources_js
