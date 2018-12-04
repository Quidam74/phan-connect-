from cloudant import Cloudant
from flask import Flask, render_template, request, jsonify
import atexit
import os
import json
from cloudant.result import Result, ResultByKey

app = Flask(__name__, static_url_path='')

db_name = 'iotp_514y4j_default_2018-12'
client = None
db = None
url = None

if 'VCAP_SERVICES' in os.environ:
    vcap = json.loads(os.getenv('VCAP_SERVICES'))
    print('Found VCAP_SERVICES')
    if 'cloudantNoSQLDB' in vcap:
        creds = vcap['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)
elif "CLOUDANT_URL" in os.environ:
    client = Cloudant(os.environ['CLOUDANT_USERNAME'], os.environ['CLOUDANT_PASSWORD'], url=os.environ['CLOUDANT_URL'], connect=True)
    db = client.create_database(db_name, throw_on_exists=False)
elif os.path.isfile('vcap-local.json'):
    with open('vcap-local.json') as f:
        vcap = json.load(f)
        print('Found local VCAP_SERVICES')
        creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
        db = client.create_database(db_name, throw_on_exists=False)

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))

def value_is_valide (document):
    return ("timestamp" in document and "data" in document and 
           "temperature" in document["data"][0] and "humidity" in document["data"][0] and
           "dew_point" in document["data"][0] and "altitude" in document["data"][0])
def getTimestamp (value):
    return value["timestamp"]

@app.route('/')
def root():
    return app.send_static_file('index.html')

# /* Endpoint to get all values in the database.
# * Send a GET request to localhost:8000/api/value/list?numberOfRows=xxx&pageToken=xxx
# * Return:
# * {
# *     size: 0,
# *     nextPageToken: xxx,
# *     values: [
# *         { timestamp: xxx, temperature: xxx, humidity: xxx, dew_point: xxx, altitude: xxx },
# *         ...
#       ]
# * }
# */
@app.route('/api/value/list', methods=['GET'])
def get_values():
    if client:
        full_datas = {
            "size": 0,
            "values": [],
            "nextPageToken": ""
        }
        
        numberOfRows =None
        if ("numberOfRows" in request.args):
            numberOfRows = request.args["numberOfRows"]
        else:
            numberOfRows = 200

        pageToken = None
        if ("pageToken" in request.args):
            pageToken = request.args["pageToken"]

        pageTokenFind = False

        print(numberOfRows)
        print(pageToken)

        for document in db:
            if (value_is_valide(document)):
                if (pageTokenFind and len(full_datas["values"]) < int(numberOfRows)):
                    full_datas["nextPageToken"] = document["_id"]
                    full_datas["values"].append({
                        "timestamp": document["timestamp"],
                        "temperature": document["data"][0]["temperature"],
                        "humidity": document["data"][0]["humidity"],
                        "dew_point": document["data"][0]["dew_point"],
                        "altitude": document["data"][0]["altitude"]
                    })
                if (pageTokenFind == False and (pageToken == None or document["_id"] == pageToken)):
                    pageTokenFind = True

        full_datas["size"] = len(full_datas["values"])
        full_datas["values"].sort(key=getTimestamp, reverse=True)
        return jsonify(full_datas)
    else:
        print('No database')
        return jsonify([])

# /* Endpoint to get the last value of captor
# * Send a GET request to localhost:8000/api/value/last
# * return:
# * { timestamp: xxx, temperature: xxx, humidity: xxx, dew_point: xxx, altitude: xxx }
# */
@app.route('/api/value/last', methods=['GET'])
def get_last_value():
    if client:
        value = {}
        for document in db:
            if (value_is_valide(document) and ("timestamp" not in value or value["timestamp"] < document["timestamp"])):
                value = {
                    "timestamp": document["timestamp"],
                    "temperature": document["data"][0]["temperature"],
                    "humidity": document["data"][0]["humidity"],
                    "dew_point": document["data"][0]["dew_point"],
                    "altitude": document["data"][0]["altitude"] 
                }
        return jsonify(value)
    else:
        print('No database')
        return jsonify([])

# /**
#  * Endpoint to get a JSON array of all the visitors in the database
#  * REST API example:
#  * <code>
#  * GET http://localhost:8000/api/visitors
#  * </code>
#  *
#  * Response:
#  * [ "Bob", "Jane" ]
#  * @return An array of all the visitor names
#  */
@app.route('/api/visitors', methods=['POST'])
def put_visitor():
    user = request.json['name']
    data = {'name':user}
    if client:
        my_document = db.create_document(data)
        data['_id'] = my_document['_id']
        return jsonify(data)
    else:
        print('No database')
        return jsonify(data)

@atexit.register
def shutdown():
    if client:
        client.disconnect()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
