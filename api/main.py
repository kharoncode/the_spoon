from flask import Flask,jsonify,request
from flask_cors import CORS
import methods

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
    
@app.route('/opening-times',methods=['GET','POST','PUT','DELETE'])
def openingTimes():
    if request.method == 'GET':
        openingTimes = methods.get_all('openingTime')
        return jsonify(openingTimes), 200
    # elif request.method == "POST":
    #     req_data = request.get_json()
    #     result = methods.add_user(req_data['name'])
    #     if result == 'Success':
    #         return jsonify({'message': f"Users {req_data['name']} successfully added !"}), 201
    #     else :
    #         return jsonify({"message":result }),409
    # elif request.method == "PUT":
    #     req_data = request.get_json()
    #     result = methods.update_user(req_data['id'],req_data['name'])
    #     if result=='Success':
    #         return jsonify({'message': f"User {req_data['name']} successfully updated !"}), 201
    #     elif result == "NameNotNull":
    #         return jsonify({'message': "User name is already in use !"}), 409
    #     else:
    #         return jsonify({"message":"User not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('openingTime',req_data['id'])
        if result=='Success':
            return jsonify({'message': "Time successfully deleted !"}), 201
        else:
            return jsonify({"message":result}),404
        
@app.route('/day/<id>')
def getDay(id):
    data = methods.get_day_openingTime(id)
    return jsonify(data)

@app.route('/days')
def getAllDays():
    data = methods.get_openingTime_for_each_days()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)