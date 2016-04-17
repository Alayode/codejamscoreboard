import sys
import os

sys.path.append(os.path.realpath('../'))
import json
from codejamscoreboard.flaskapp import db, Competitor

json_name = 'competitorsdata.json'

db.drop_all()
db.create_all()

with open(json_name) as data_file:
    data = json.load(data_file)

for row in data:
    db.session.add(
        Competitor(username=row['n'],
                   country=row['c'],
                   country_flag=row['fu'],
                   rank=row['r'],
                   points=row['pts']
                   ))

db.session.commit()
