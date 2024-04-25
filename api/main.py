from flask import Flask,jsonify,request
from flask_cors import CORS
import methods

app = Flask(__name__)
CORS(app)

methods.init()

@app.route('/users',methods=['GET','POST','PUT','DELETE'])
def users():
    if request.method == 'GET':
        users = methods.get_all_users()
        return jsonify(users), 200
    elif request.method == "POST":
        user_data = request.get_json()
        methods.add_user(user_data['name'])
        return jsonify({'message': f"Users {user_data['name']} successfully added !"}), 201
    elif request.method == "PUT":
        user_data = request.get_json()
        methods.update_user(user_data['name'],user_data['id'])
        return jsonify({'message': f"Users {user_data['name']} successfully updated !"}), 201
    elif request.method == 'DELETE':
        user_data = request.get_json()
        methods.delete_user(user_data['id'])
        return jsonify({'message': f"Users {user_data['name']} successfully deleted !"}), 201

if __name__ == '__main__':
    app.run(debug=True)