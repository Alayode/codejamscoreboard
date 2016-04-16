from requests import get
from json import load, dump

err = 'err'
rows = 'rows'
datafilename = './data/competitorsdata.json'

url = "https://code.google.com/codejam/contest/6254486/scoreboard/do/?cmd=GetScoreboard&contest_id=6254486&show_type=all&start_pos={0}"
competitor_num = 1
data = []
while True:
    print("Downloading from competitor number {0} ...".format(competitor_num))
    res = get(url.format(competitor_num)).json()
    if err in res:
        print("Error: {0}".format(res[err]))
        if res[err] == 'invalid value for parameter sp':
            break
        else:
            continue
    print("Downloaded {0} rows".format(len(res[rows])))
    data += res[rows]
    competitor_num += len(res[rows])

with open(datafilename, 'w') as outfile:
    dump(data, outfile)
