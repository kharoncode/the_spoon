from flask import Flask,jsonify,request
from flask_cors import CORS
import methods

app = Flask(__name__)
CORS(app)

methods.init()

@app.route('/users',methods=['GET'])
def get_users():
    users = methods.get_all_users()
    return jsonify(users), 200

@app.route('/users', methods=['POST'])
def create_user():
    user_data = request.get_json()
    methods.add_user(user_data['name'])
    return jsonify({'message': f"Users {user_data['name']} successfully added!"}), 201

if __name__ == '__main__':
    app.run(debug=True)