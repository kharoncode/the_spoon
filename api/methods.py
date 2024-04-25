import sqlite3

def get_connection():
    connection = sqlite3.connect('db_spoon.sqlite')
    connection.row_factory = sqlite3.Row
    return connection

def init():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    cursor.execute("CREATE TABLE IF NOT EXISTS tables (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, size INTEGER NOT NULL);")
    cursor.execute("CREATE TABLE IF NOT EXISTS daysOfTheWeek (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    # cursor.execute("DROP TABLE openingTime;")
    cursor.execute("CREATE TABLE IF NOT EXISTS openingTime (id INTEGER PRIMARY KEY, day_id INTEGER, start_time TEXT, end_time TEXT, FOREIGN KEY (day_id) REFERENCES daysOfTheWeek(id));")
    cursor.execute("CREATE TABLE IF NOT EXISTS booking (id INTEGER PRIMARY KEY, user_id INTEGER, table_id INTEGER, date TIMESTAMP, customers_nbr INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (table_id) REFERENCES tables(id))")

    # cursor.execute("INSERT INTO tables (name, size) VALUES ('petit',2), ('moyen',4), ('gros',5);")
    # cursor.execute("INSERT INTO daysOfTheWeek (name) VALUES ('Lundi'), ('Mardi'), ('Mercredi'), ('Jeudi'),('Vendredi'), ('Samedi'),('Dimanche');")
    # cursor.execute("INSERT INTO openingTime (day_id, start_time, end_time) VALUES (1, '11:00', '14:00'), (1, '18:00', '21:00'),(2, '11:00', '14:00'), (2, '18:00', '21:00'),(3, '11:00', '14:00'), (3, '18:00', '21:00'),(4, '11:00', '14:00'), (4, '18:00', '21:00'),(5, '11:00', '14:00'), (5, '18:00', '21:00'),(6, '11:00', '14:00'), (6, '18:00', '21:00'),(7, '11:00', '14:00'), (7, '18:00', '21:00');")
    # connection.commit()


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

def update_user(name,id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('UPDATE users SET name=(?) WHERE id=(?)', (name,id,))
    connection.commit()

def delete_user(id):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute('DELETE FROM users WHERE id=(?)', (id,))
    connection.commit()