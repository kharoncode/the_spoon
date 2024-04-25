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


def get_all(db):
    connection = get_connection()
    cursor = connection.cursor()
    users = cursor.execute('SELECT * FROM (?)',(db)).fetchall()
    users_list = [dict(row) for row in users]
    return users_list


# USERS
def get_one_user(id):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id=(?)',(id,)).fetchone()
    if user:
        return dict(user)
    else:
        return None

def add_user(name):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE name=(?)',(name,)).fetchone()
    if not user:
        cursor.execute('INSERT INTO users (name) VALUES (?)', (name,))
        connection.commit()
        return 'Success'
    else:
        return None

def update_user(name,id):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute(f'SELECT * FROM users WHERE id={id}').fetchone()
    if user:
        cursor.execute('UPDATE users SET name=(?) WHERE id=(?)', (name,id,))
        connection.commit()
        return "Success"
    else:
        return None

def delete_user(id):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute(f'SELECT * FROM users WHERE id={id}').fetchone()
    if user:
        cursor.execute('DELETE FROM users WHERE id=(?)', (id,))
        connection.commit()
        return "Success"
    else:
        return None