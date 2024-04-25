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
        user_data = request.get_json()
        result = methods.add_user(user_data['name'])
        if result == 'Success':
            return jsonify({'message': f"Users {user_data['name']} successfully added !"}), 201
        else :
            return jsonify({"message":"The user name is already in use" }),409
    elif request.method == "PUT":
        user_data = request.get_json()
        result = methods.update_user(user_data['name'],user_data['id'])
        if result=='Success':
            return jsonify({'message': f"Users {user_data['name']} successfully updated !"}), 201
        else:
            return jsonify({"message":"User not found !"}),404
    elif request.method == 'DELETE':
        user_data = request.get_json()
        result = methods.delete_user(user_data['id'])
        if result=='Success':
            return jsonify({'message': f"Users {user_data['name']} successfully deleted !"}), 201
        else:
            return jsonify({"message":"User not found !"}),404

@app.route('/user/<id>', methods=['GET'])
def user(id):
    user = methods.get_one_user(id)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'message':"User not found !"}),404



if __name__ == '__main__':
    app.run(debug=True)