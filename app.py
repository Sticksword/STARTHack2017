#!/usr/bin/env python

import json
import os
import csv
import atexit
import requests
import sqlite3
import random

from flask import Flask, g, url_for, redirect, request, make_response, send_from_directory, render_template, jsonify, render_template_string


# Flask app should start in global layout
app = Flask(__name__, static_url_path='')

# Database config & private methods

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

# End DB stuff

@app.route('/')
def index():
    return render_template('login.html')


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


# Deutsch Bank API stuff

@app.route('/login')
def login():
    return redirect('https://simulator-api.db.com/gw/oidc/authorize?response_type=code&client_id=88dfa85a-eb83-43c5-a739-47baf8234c15&state=http://localhost:5000/callback&redirect_uri=http://localhost:5000/callback', code=302)

@app.route('/callback')
def auth_callback():
    print('callback')
    print(request)
    code = request.args.get('code')

    url = 'https://simulator-api.db.com/gw/oidc/token'

    # payload = 'grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&code=' + code
    payload = 'grant_type=authorization_code&redirect_uri=http://start-hack.herokuapp.com/callback&code=' + code
    headers = {
        'authorization': 'Basic ODhkZmE4NWEtZWI4My00M2M1LWE3MzktNDdiYWY4MjM0YzE1OmIwXy1sR1BUd05paFZuTDhjazVyLWpUZnA3V01YY1JZOUtMNW1OT1BBVUNGWkZNNGNVX0tjU3Y1U3JzZ2hKSlVtOTJCd3pRYXpBOGt3SXZqeS04djZn',
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache',
        'postman-token': 'b9b43acb-e462-b49b-d4fd-18de9fe1ff30'
        }

    response = requests.request('POST', url, data=payload, headers=headers)

    res = json.loads(response.text)
    print(res)
    print(res['access_token'])
    with open('access_token', 'w') as f:
        f.write(res['access_token'])
    # in_memory_access_token.encode('ascii','ignore')
    return render_template('index.html')
    # can redirect here or something


@app.route('/transactions')
def transactions():
    print('transactions')
    with open('access_token', 'r') as f:
        token = f.read()

    print(token)
    url = 'https://simulator-api.db.com/gw/dbapi/v1/transactions'

    headers = {
        'authorization': 'Bearer ' + token,
        'cache-control': 'no-cache',
        'postman-token': 'f69c186c-4835-241a-02d2-59286fcfb235'
        }

    response = requests.request('GET', url, headers=headers)

    res = json.loads(response.text)
    print(res)
    if type(res) == list:
        return jsonify({'transactions': res})
    if res['errorDescription'] and res['errorDescription'] == 'Invalid access token':
        return redirect('/login')
    else:
        return jsonify(res)

@app.route('/userInfo')
def userInfo():
    print('userInfo')
    with open('access_token', 'r') as f:
        token = f.read()

    print(token)
    url = 'https://simulator-api.db.com/gw/dbapi/v1/userInfo'

    headers = {
        'authorization': 'Bearer ' + token,
        'cache-control': 'no-cache',
        'postman-token': 'f69c186c-4835-241a-02d2-59286fcfb235'
        }

    response = requests.request('GET', url, headers=headers)

    res = json.loads(response.text)
    print(res)
    if 'errorDescription' in res and res['errorDescription'] == 'Invalid access token':
        return redirect('/login')
    else:
        return jsonify(res)


@app.route('/bankAccountInfo')
def bankAccountInfo(): # 100.95
    print('bankAccountInfo')
    return jsonify({'balance': 800.95 })
    # with open('access_token', 'r') as f:
    #     token = f.read()
    #
    # print(token)
    # url = 'https://simulator-api.db.com/gw/dbapi/v1/cashAccounts'
    #
    # headers = {
    #     'authorization': 'Bearer ' + token,
    #     'cache-control': 'no-cache'
    #     }
    #
    # response = requests.request('GET', url, headers=headers)
    #
    # res = json.loads(response.text)
    # print(res)
    # if 'errorDescription' in res and res['errorDescription'] == 'Invalid access token':
    #     return redirect('/login')
    # else:
    #     return jsonify(res)

# Yelp API stuff
@app.route('/businesses')
def businesses(loc=None, persona=None):
    with open('yelp_access_token', 'r') as f:
        token = f.read().strip()

    url = 'https://api.yelp.com/v3/businesses/search'

    if not loc:
        loc = 'Zurich'
    if not persona:
        persona = 'student'

    if persona == 'student':
        prices = 1
    elif persona == 'family':
        prices = 2
    elif persona == 'business':
        prices = 3
    else:
        prices = 4
    # prices = map(str, [1, 2, 3])
    # prices = ','.join(prices)

    querystring = {'location': loc, 'price': prices, 'limit': '5'}

    headers = {
        'authorization': 'Bearer ' + token,
        'cache-control': 'no-cache'
        }

    response = requests.request('GET', url, headers=headers, params=querystring)

    res = json.loads(response.text)
    res = res['businesses']
    return json.dumps(res)

# Trip generation logic

@app.route('/destinations')
def destinations():
    persona = request.args.get('persona')
    duration = int(request.args.get('duration'))
    month = request.args.get('month')

    loc = []
    loc.append(
      {
        'id': 'london',
        'name': 'London',
        'total_expense': 300 + 176 * duration
      }
    )
    loc.append(
      {
        'id': 'paris',
        'name': 'Paris',
        'total_expense': 500 + 176 * duration
      }
    )
    loc.append(
      {
        'id': 'nyc',
        'name': 'New York City',
        'total_expense': 700 + 176 * duration
      }
    )
    loc.append(
      {
        'id': 'barcelona',
        'name': 'Barcelona',
        'total_expense': 100 + 176 * duration
      }
    )
    loc.append(
      {
        'id': 'zurich',
        'name': 'Zurich',
        'total_expense': 600 + 176 * duration
      }
    )

    return jsonify(loc)

@app.route('/details')
def planItinerary():
    destination = request.args.get('destination')
    persona = request.args.get('persona')
    duration = int(request.args.get('duration'))
    month = request.args.get('month')

    info = { 'name': destination }

    info['top_rated_local_busineses'] = buildBusinessExpenses(destination, persona)
    info['flights'] = buildFlightExpenses(destination, persona, month)
    info['expenses'] = {
            'Accomodation': 69 * duration,
            'Transport': 25 * duration,
            'Culture': 19 * duration,
            'Dining': 29 * duration,
            'Shopping': 15 * duration,
            'Other': 19 * duration
        }

    return jsonify(info)


# add yelp and amadeus integraton here
def buildBusinessExpenses(destination, persona):
    local_businesses = json.loads(businesses(destination, persona))

    potential_business_expenses = []
    for biz in local_businesses:
        cost = len(biz['price']) * 10 + random.randint(0, 10)
        potential_business_expenses.append({
            'category': biz['categories'][0]['title'],
            'price': cost,
            'business_name': biz['name'],
            'image_url': biz['image_url']
        })
        # print(biz['name'])

    return potential_business_expenses


def buildFlightExpenses(destination, persona, month):
    possible_flights = json.loads(flights(destination, persona, month))
    group = 'economy'
    if persona == 'student':
        group = 'economy'
    elif persona == 'family':
        group = 'economy'
    elif persona == 'business':
        group = 'business'
    else:
        group = '1st class'

    potential_flight_expenses = []
    for flight in possible_flights:
        potential_flight_expenses.append({
            'total_price': flight['fare']['total_price'],
            'class': group
        })

    return potential_flight_expenses


# Amadeus API stuff

@app.route('/flights')
def flights(destination, persona, month):
    orig = 'BER'
    dest = 'LON'
    destination = dest.upper()
    if destination == 'PARIS':
        dest = 'CDG'
    elif destination == 'BARCELONA':
        dest = 'BCN'
    elif destination == 'NYC':
        dest = 'JFK'
    elif destination == 'ZURICH':
        dest = 'ZRH'

    dep_date = '2017-' + '05' + '-01'
    ret_date = '2017-' + '05' + '-07'
    num_results = '3'

    url = 'http://api.sandbox.amadeus.com/v1.2/flights/low-fare-search'

    querystring = {
        'origin':orig,
        'destination':dest,
        'departure_date':dep_date,
        'return_date':ret_date,
        'number_of_results':num_results,
        'apikey':'hUC0xqSrg9Crf4lbVTjcx1hRzUg4si4Q'
        }

    headers = {
        'cache-control': 'no-cache'
        }

    response = requests.request('GET', url, headers=headers, params=querystring)

    print(response.text)

    res = json.loads(response.text)

    return json.dumps(res['results'])



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

@atexit.register
def goodbye():
    print('You are now leaving the Python sector.')

# end examples

def init():
    print('initializing')
    init_db()

# main

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print('Starting app on port %d' % port)
    init()
    app.run(debug=True, port=port, host='0.0.0.0')
    url_for('static', filename='app.js')
    url_for('static', filename='common.js')
    url_for('static', filename='app.css')
