from flask import Flask,jsonify,request
from flask_cors import CORS
import methods
import operator

app = Flask(__name__)
CORS(app)

methods.init()

# USERS
@app.route('/users',methods=['GET','POST','PUT','DELETE'])
def users():
    if request.method == 'GET':
        users = methods.get_all('users')
        return jsonify(users), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = methods.add_user(req_data['name'])
        if result == 'Success':
            return jsonify({'message': f"Users {req_data['name']} successfully added !"}), 201
        else :
            return jsonify({"message":result }),409
    elif request.method == "PUT":
        req_data = request.get_json()
        result = methods.update_user(req_data['id'],req_data['name'])
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
            return jsonify({'message': "User successfully deleted !"}), 201
        else:
            return jsonify({"message":result}),404

@app.route('/user/<id>', methods=['GET'])
def user(id):
    user = methods.get_one_with_params('users',"id",id)
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
        result = methods.add_table(req_data['name'],req_data['size'])
        if result == 'Success':
            return jsonify({'message': f"Tables {req_data['name']} successfully added !"}), 201
        else :
            return jsonify({"message":"The table name is already in use" }),409
    elif request.method == "PUT":
        req_data = request.get_json()
        result = methods.update_table(req_data['id'],req_data['name'],req_data['size'])
        if result=='Success':
            return jsonify({'message': f"Table {req_data['name']} successfully updated !"}), 201
        elif result == 'NameNotNull':
            return jsonify({'message': "Table name is already in use !"}), 409
        else:
            return jsonify({"message":"Table not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('tables',req_data['id'])
        if result=='Success':
            return jsonify({'message': "Table successfully deleted !"}), 201
        else:
            return jsonify({"message":"Table not found !"}),404

@app.route('/tables/available',methods=['GET'])
def tables_availables():
    date = int(request.args.get('date'))
    if not date:
        return jsonify({'message':"Please provide a parameters table_id and date"}),400
    tables_list = methods.get_all('tables')
    tables_unavailable = methods.tables_occupied_for_date(date)
    unavailable_ids = []
    for table in tables_unavailable:
        unavailable_ids.append(table['table_id'])
    tables_availables_list = []
    for table in tables_list:
        if table['id'] not in unavailable_ids:
            tables_availables_list.append(table)
    return jsonify(tables_availables_list), 200

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
@app.route('/opening-times',methods=['GET','POST'])
def openingTimes():
    if request.method == 'GET':
        openingTimes = methods.get_all('openingTime')
        return jsonify(openingTimes), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = methods.edit_openingTime(req_data['day_id'],req_data['data'])
        return jsonify(result), 201
        
@app.route('/day/<id>')
def getDay(id):
    data = methods.get_day_openingTime(id)
    return jsonify(data)

@app.route('/days')
def getAllDays():
    data = methods.get_openingTime_for_each_days()
    return jsonify(data)

# BOOKING
@app.route('/bookings',methods=['GET','POST','PUT','DELETE'])
def bookings():
    if request.method == 'GET':
        bookings = methods.get_all('booking')
        bookings.sort(reverse=True,key=operator.itemgetter('current_date'))
        return jsonify(bookings), 200
    elif request.method == "POST":
        req_data = request.get_json()
        result = methods.add_booking(req_data['user_id'],req_data['table_id'],req_data['date'],req_data['customers_nbr'],req_data['status'])
        if result['status'] == "Success":
            return jsonify({'message': result["message"]}), 201
        else:
            return jsonify({'message': result["message"]}), 409
    elif request.method == "PUT":
        req_data = request.get_json()
        result = methods.update_booking(req_data['id'],req_data['table_id'],req_data['date'],req_data['customers_nbr'],req_data['status'])
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
            return jsonify({'message': "Booking successfully deleted !"}), 201
        else:
            return jsonify({"message":result}),404



if __name__ == '__main__':
    app.run(debug=True)