from flask import Flask,jsonify,request
from flask_cors import CORS
import methods
import users_methods
import tables_methods
import opening_times_methods
import bookings_methods
import operator
import restaurants_methods


app = Flask(__name__)
CORS(app)

# methods.init()


#RESTAURANTS
@app.route('/restaurants',methods=['GET','PUT'])
def restaurants():
    if request.method == 'GET':
        restaurants = methods.get_all('restaurants')
        return jsonify(restaurants),200
    if request.method == 'PUT':
        req_data = request.get_json()
        restaurants = restaurants_methods.update_restaurant(req_data['id'],req_data['name'],req_data['address'],req_data['phone'],req_data['cuisine'])
        return jsonify(restaurants),201


# USERS
@app.route('/users',methods=['GET','POST','PUT','DELETE'])
def users():
    if request.method == 'GET':
        users = methods.get_all('users')
        return jsonify(users), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = users_methods.add_user(req_data['firstName'],req_data['lastName'],req_data['mail'],req_data['phone'],req_data['password'])
        if result['status'] == 'success':
            return jsonify({'id':result['id'],'message': f"Users {req_data['mail']} successfully added !"}), 201
        else :
            return jsonify({"message":result['message'] }),409
    elif request.method == "PUT":
        req_data = request.get_json()
        result = users_methods.update_user(req_data['id'],req_data['name'])
        if result=='Success':
            return jsonify({'message': f"User {req_data['name']} successfully updated !"}), 201
        elif result == "NameNotNull":
            return jsonify({'message': "User name is already in use !"}), 409
        else:
            return jsonify({"message":"User not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('users',req_data['id'])
        if result=='Success':
            newList = methods.get_all('users')
            return jsonify(newList), 201
        else:
            return jsonify({"message":result}),404

@app.route('/user', methods=['GET'])
def get_user():
    id = request.args.get('id')
    name = request.args.get('name')
    if not id and not name:
        return jsonify({'message':"Please provide a parameter (id, name)"}),400

    if id:
        user = users_methods.get_user_information(id)
    elif name:  
        user = methods.get_one_with_params('users','name',name)
         
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'message':"User not found !"}),404

# TABLES
@app.route('/tables', methods=['GET','POST','PUT','DELETE'])
def tables():
    if request.method == 'GET':
        tables = methods.get_all('tables')
        return jsonify(tables), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = tables_methods.add_table(req_data['name'],req_data['size'])
        if result == 'Success':
            newList = methods.get_all('tables')
            return jsonify(newList), 201
        else :
            return jsonify({"status":409,"result":"The table name is already in use"}),409
    elif request.method == "PUT":
        req_data = request.get_json()
        result = tables_methods.update_table(req_data['id'],req_data['name'],req_data['size'])
        if result=='Success':
            tables = methods.get_all('tables')
            return jsonify(tables), 201
        elif result == 'NameNotNull':
            return jsonify({"status":409,"result":"Ce nom de table est déjà utilisé."}), 409
        else:
            return jsonify({"message":"Table not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('tables',req_data['id'])
        if result=='Success':
            newList = tables = methods.get_all('tables')
            return jsonify(newList), 201
        else:
            return jsonify({"message":"Table not found !"}),404

@app.route('/tables/available',methods=['GET'])
def tables_availables_by_date():
    date = int(request.args.get('date'))
    if not date:
        return jsonify({'message':"Please provide a parameters table_id and date"}),400
    tables_list = tables_methods.get_tables_information(date)
    return jsonify(tables_list),200

@app.route('/tables/max-size-available',methods=['GET'])
def max_size_availables_by_date():
    date = int(request.args.get('date'))
    if not date:
        return jsonify({'message':"Please provide a parameters table_id and date"}),400
    tables_list = tables_methods.max_customer(date)
    return jsonify(tables_list),200


@app.route('/table', methods=['GET'])
def table():
    id = request.args.get('id')
    name = request.args.get('name')
    size = request.args.get('size')
    if not id and not name and not size :
        return jsonify({'message':"Please provide a parameter (id, size or name)"}),400

    if id:
        table = methods.get_one_with_params('tables','id', id)
    elif name:
        table = methods.get_one_with_params('tables','name',name)
    elif size:
        table = methods.get_all_with_params('tables','size',size)
         
    if table:
        return jsonify(table), 200
    else:
        return jsonify({'message':"Table not found !"}),404



# OPENINGTIME
@app.route('/opening-times',methods=['GET','PUT'])
def openingTimes():
    if request.method == 'GET':
        openingTimes = methods.get_all('openingTime')
        return jsonify(openingTimes), 200
    elif request.method == "PUT":
        req_data = request.get_json()
        result = opening_times_methods.update_openingTime(req_data)
        return jsonify(result), 201

@app.route('/opening-times/open-days',methods=['GET'])
def openDays():
    openDays_list = opening_times_methods.get_openingTime_days_list()
    return jsonify(openDays_list)

@app.route('/day/<id>')
def getDay_by_id(id):
    data = opening_times_methods.get_day_openingTime(id)
    return jsonify(data)

@app.route('/day/list/<id>')
def getDay_by_id_list(id):
    data = opening_times_methods.get_day_openingTime(id)
    return jsonify(data)

@app.route('/days')
def getAllDays():
    data = opening_times_methods.get_openingTime_for_each_days()
    return jsonify(data)

@app.route('/days/list')
def getDays_list():
    data = methods.get_all('openingTime')
    days_list = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            0: []
        }
    for el in data:
        temp_list = []
        for i in range(el['start_time'],el['end_time']-15,15):
            if el['content'] != 'closed':
                temp_list.append(i)
        
        if el['day_id'] == 7:
            days_list[0].append(temp_list)
        else :
            days_list[el['day_id']].append(temp_list)
        
    return jsonify(days_list)

# BOOKING
@app.route('/bookings',methods=['GET','POST','PUT','DELETE'])
def bookings():
    if request.method == 'GET':
        bookings = methods.get_all('booking')
        bookings.sort(reverse=True,key=operator.itemgetter('current_date'))
        return jsonify(bookings), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = bookings_methods.add_booking(req_data['user_id'],req_data['user_name'],req_data['table_id'],req_data['table_size'],req_data['date'],req_data['customers_nbr'],req_data['status'])
        if result['status'] == "invalid":
            return jsonify(result), 409
        else:
            return jsonify(result), 201
    elif request.method == "PUT":
        req_data = request.get_json()
        result = bookings_methods.update_booking_with_id(req_data['id'],req_data['table_id'],req_data['table_size'],req_data['date'],req_data['customers_nbr'],req_data['status'])
        if result=='Success':
            return jsonify({'message': f"Booking #{req_data['id']} successfully updated !"}), 201
        elif result == 'TooSmall':
            return jsonify({'message': "Table too small !"}), 409
        else:
            return jsonify({"message":"Booking not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('booking',req_data['id'])
        if result=='Success':
            newList = methods.get_all('booking')
            return jsonify(newList), 201
        else:
            return jsonify({"message":result}),404

@app.route('/bookings/canceled',methods=['DELETE'])
def canceled_booking_by_date():
    date = request.args.get('date')
    if date:
        result = bookings_methods.delete_booking_with_date(date)
        if result=='Success':
            return jsonify({"message":result}), 201
        else:
            return jsonify({"message":result}),404
    else :
        return jsonify({'message':"Please provide a parameter date"}),400

@app.route('/hours/isAvailable',methods=['GET'])
def is_hours_availables_by_date():
    date = int(request.args.get('date'))
    if not date:
        return jsonify({'message':"Please provide a parameters table_id and date"}),400
    tables_list = bookings_methods.is_fullDate_valide(date)
    return jsonify(tables_list),200

if __name__ == '__main__':
    app.run(debug=True)