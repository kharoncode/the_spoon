from flask import Flask,jsonify,request
from flask_cors import CORS
import methods

app = Flask(__name__)
CORS(app)

methods.init()

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
            return jsonify({'message': f"User name is already in use !"}), 409
        else:
            return jsonify({"message":"User not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('users',req_data['id'])
        if result=='Success':
            return jsonify({'message': f"User successfully deleted !"}), 201
        else:
            return jsonify({"message":result}),404

@app.route('/user/<id>', methods=['GET'])
def user(id):
    user = methods.get_with_id('users',id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'message':"User not found !"}),404

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
            return jsonify({'message': f"Table name is already in use !"}), 409
        else:
            return jsonify({"message":"Table not found !"}),404
    elif request.method == 'DELETE':
        req_data = request.get_json()
        result = methods.delete_with_id('tables',req_data['id'])
        if result=='Success':
            return jsonify({'message': f"Table successfully deleted !"}), 201
        else:
            return jsonify({"message":"Table not found !"}),404

@app.route('/table/<id>', methods=['GET'])
def table(id):
    table = methods.get_with_id('tables',id)
    if table:
        return jsonify(table), 200
    else:
        return jsonify({'message':"Table not found !"}),404

if __name__ == '__main__':
    app.run(debug=True)