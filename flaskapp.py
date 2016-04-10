import os
from datetime import datetime
import json
from collections import namedtuple
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

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

@app.route('/comps/<country>/<int:page>')
def competitorsByCountry(country, page):
    #comps = Competitor.query.filter_by(country=country) \
    #    .order_by(Competitor.rank).limit(30).offset(offset).all()
    #return Response(json.dumps([c.serialize for c in comps]),  mimetype='application/json')
    sql = text(
        '''SELECT *,
                (SELECT COUNT(*)
                    FROM  competitor AS c2
                    WHERE country = :country and c2.rank <= c1.rank
                ) AS row_num
            FROM competitor AS c1
            WHERE country = :country
            LIMIT :limit OFFSET :offset
        ''')
    limit = 30
    offset = page * limit;
    comps = db.engine.execute(sql, country=country, limit=limit, offset=offset)
    Record = namedtuple('Record', comps.keys())
    records = [Record(*r)._asdict() for r in comps.fetchall()]

    tot = Competitor.query.filter_by(country=country).count()

    return Response(json.dumps({'num':tot, 'data':records}),  mimetype='application/json')
    
@app.route('/countries')
def countries():
    countries = Competitor.query \
        .distinct(Competitor.country).group_by(Competitor.country) \
        .order_by(Competitor.country).all()
    return Response(json.dumps([c.country for c in countries]), mimetype='application/json')

@app.route('/page/<user>')
def getPageFromUser(user):
    sql = text(
        '''SELECT *,
                (SELECT COUNT(*)
                    FROM  competitor AS c2
                    WHERE country = c1.country and c2.rank <= c1.rank
                ) AS row_num
            FROM competitor AS c1
            WHERE username = :username
        ''')
    comps = db.engine.execute(sql, username=user)
    Record = namedtuple('Record', comps.keys())
    records = [Record(*r)._asdict() for r in comps.fetchall()]
    limit = 30
    if len(records) > 0:
        res = {'page':records[0]['row_num'] / limit, 'country': records[0]['country']}
    else:
        res = {}
    return jsonify(res)

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
