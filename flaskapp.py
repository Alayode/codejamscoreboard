import os
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config.from_pyfile('flaskapp.cfg')
db = SQLAlchemy(app)

class Competitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    country = db.Column(db.String(20))
    country_flag = db.Column(db.String(20))
    rank = db.Column(db.Integer)
    points = db.Column(db.Integer)

    def __init__(self, username, country, country_flag, rank, points):
        self.username = username
        self.country = country
        self.country_flag = country_flag
        self.rank = rank
        self.points = points

    @property
    def serialize(self):
       """Return object data in easily serializeable format"""
       return {
           'username': self.username,
           'country': self.country,
           'country_flag': self.country_flag,
           'rank': self.rank,
           'points': self.points
       }

    def __repr__(self):
        return '<User %r>' % self.username

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/comps/<country>/<int:offset>')
def competitorsByCountry(country, offset):
    comps = Competitor.query.filter_by(country=country).limit(30).offset(offset).all()
    return Response(json.dumps([c.serialize for c in comps]),  mimetype='application/json')

@app.route('/<path:resource>')
def serveStaticResource(resource):
    if resource.startswith('node_modules'):
        directory = 'node_modules/'
        resource = resource[len(directory):]
    else:
        directory = 'static/'
    return send_from_directory(directory, resource)

if __name__ == '__main__':
    app.run()
