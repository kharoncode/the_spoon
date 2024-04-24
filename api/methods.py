import sqlite3

def get_connection():
    connection = sqlite3.connect('db_spoon.sqlite')
    connection.row_factory = sqlite3.Row
    return connection

def init():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);")

def get_all_users():
    connection = get_connection()
    cursor = connection.cursor()
    users = cursor.execute('SELECT * FROM users').fetchall()
    users_list = [dict(row) for row in users]
    return users_list

def add_user(name):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('INSERT INTO users (name) VALUES (?)', (name,))
    connection.commit()