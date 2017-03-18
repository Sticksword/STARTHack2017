#!/usr/bin/env python

import json
import os
import csv
import atexit
import requests
import sqlite3

from flask import Flask, g, redirect, request, make_response, send_from_directory, render_template, jsonify, render_template_string


# Flask app should start in global layout
app = Flask(__name__, static_url_path='')

DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    print(exception)
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.route('/')
def index():
    return 'hello world'


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/login')
def login():
    return redirect("https://simulator-api.db.com/gw/oidc/authorize?response_type=code&client_id=88dfa85a-eb83-43c5-a739-47baf8234c15&state=http://localhost:5000/callback&redirect_uri=http://localhost:5000/callback", code=302)

@app.route('/callback')
def auth_callback():
    print('callback')
    print(request)
    code = request.args.get('code')

    url = "https://simulator-api.db.com/gw/oidc/token"

    payload = "grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&code=" + code
    headers = {
        'authorization': "Basic ODhkZmE4NWEtZWI4My00M2M1LWE3MzktNDdiYWY4MjM0YzE1OmIwXy1sR1BUd05paFZuTDhjazVyLWpUZnA3V01YY1JZOUtMNW1OT1BBVUNGWkZNNGNVX0tjU3Y1U3JzZ2hKSlVtOTJCd3pRYXpBOGt3SXZqeS04djZn",
        'content-type': "application/x-www-form-urlencoded",
        'cache-control': "no-cache",
        'postman-token': "b9b43acb-e462-b49b-d4fd-18de9fe1ff30"
        }

    response = requests.request("POST", url, data=payload, headers=headers)

    res = json.loads(response.text)
    print(res)
    print(res['access_token'])
    with open('access_token', 'w') as f:
        f.write(res['access_token'])
    # in_memory_access_token.encode('ascii','ignore')
    return 'login success!' # can redirect here or something


@app.route('/transactions')
def transactions():
    print('transactions')
    with open('access_token', 'r') as f:
        token = f.read()

    print(token)
    url = "https://simulator-api.db.com/gw/dbapi/v1/transactions"

    headers = {
        'authorization': "Bearer " + token,
        'cache-control': "no-cache",
        'postman-token': "f69c186c-4835-241a-02d2-59286fcfb235"
        }

    response = requests.request("GET", url, headers=headers)

    res = json.loads(response.text)
    print(res)
    if type(res) == list:
        return jsonify({'transactions': res})
    if res['errorDescription'] and res['errorDescription'] == 'Invalid access token':
        return redirect('/login')
    else:
        return res



# example stuff, can ignore

@app.route('/export', methods=['GET'])
def export_records():
    return excel.make_response_from_array([[1,2], [3, 4]], 'csv', file_name='export_data')


@app.route('/example_post', methods=['POST'])
def webhook():
    req = request.get_json(silent=True, force=True)

    print('Request:')
    print((json.dumps(req, indent=4)))

    res = { 'sample': 'text' }

    res = json.dumps(res, indent=4)

    r = make_response(res)
    r.headers['Content-Type'] = 'application/json'
    return r


@app.route('/user/<username>')
def show_user_profile(username):
    # show the user profile for that user
    return 'User %s' % username

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id


def init():
    print('initializing')
    init_db()

@atexit.register
def goodbye():
    print('You are now leaving the Python sector.')

# end examples

# main

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print('Starting app on port %d' % port)
    init()
    app.run(debug=True, port=port, host='0.0.0.0')
