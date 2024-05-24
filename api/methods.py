import sqlite3


def get_connection():
    connection = sqlite3.connect('db_spoon.sqlite')
    connection.row_factory = sqlite3.Row
    return connection

def init():
    connection = get_connection()
    cursor = connection.cursor()
    # cursor.execute("DROP TABLE booking;")
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, mail VARCHAR(30) NOT NULL UNIQUE, password VARCHAR(30) NOT NULL UNIQUE);")
    cursor.execute("CREATE TABLE IF NOT EXISTS tables (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, size INTEGER NOT NULL);")
    cursor.execute("CREATE TABLE IF NOT EXISTS daysOfTheWeek (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    cursor.execute("CREATE TABLE IF NOT EXISTS openingTime (id INTEGER PRIMARY KEY, day_id INTEGER, day_time VARCHAR(20), start_time INTEGER, end_time INTEGER, content VARCHAR(20), FOREIGN KEY (day_id) REFERENCES daysOfTheWeek(id));")
    cursor.execute("CREATE TABLE IF NOT EXISTS booking (id INTEGER PRIMARY KEY, user_id INTEGER, user_name VARCHAR(20), table_id INTEGER, table_size INTEGER, date INTEGER, customers_nbr INTEGER, status VARCHAR(15), current_date DATE, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (table_id) REFERENCES tables(id))")
    cursor.execute("CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name VARCHAR(20), address TEXT(250), phone INTEGER(14), cuisine VARCHAR(30));")
    
    # cursor.execute("INSERT INTO tables (name, size) VALUES ('petit',2), ('moyen',4), ('gros',5);")
    # cursor.execute("INSERT INTO daysOfTheWeek (name) VALUES ('lundi'), ('mardi'), ('mercredi'), ('jeudi'),('vendredi'), ('samedi'),('dimanche');")
    # cursor.execute("INSERT INTO openingTime (day_id, day_time, start_time, end_time, content) VALUES (1, 'lunch', 660, 840, '11:00-14:00'), (1, 'dinner', 660, 1260, '18:00-21:00'),(2, 'lunch', 660, 840, '11:00-14:00'), (2, 'dinner', 660, 1260, '18:00-21:00'),(3, 'lunch', 660, 840, '11:00-14:00'), (3, 'dinner', 660, 1260, '18:00-21:00'),(4, 'lunch', 660, 840, '11:00-14:00'), (4, 'dinner', 660, 1260, '18:00-21:00'),(5, 'lunch', 660, 840, '11:00-14:00'), (5, 'dinner', 660, 1260, '18:00-21:00'),(6, 'lunch', 660, 840, '11:00-14:00'), (6, 'dinner', 660, 1260, '18:00-21:00'),(7, 'lunch', 0, 0, 'closed'),(7, 'dinner', 0, 0, 'closed');")
    # cursor.execute("INSERT INTO restaurants (name,address,phone,cuisine) VALUES ('My Restaurant','1 impasse des Marguerites','0033123456789','HomeMade');")
    # connection.commit()
    connection.close()


def get_all(db):
    connection = get_connection()
    cursor = connection.cursor()
    users = cursor.execute(f'SELECT * FROM {db}').fetchall()
    users_list = [dict(row) for row in users]
    connection.close()
    return users_list


def get_one_with_params(db, where, params):
    connection = get_connection()
    cursor = connection.cursor()
    data = cursor.execute(f'SELECT * FROM {db} WHERE {where}=(?)',(params,)).fetchone()
    connection.close()
    if data:
        return dict(data)
    else:
        return None
    
def get_all_with_params(db, where, params):
    connection = get_connection()
    cursor = connection.cursor()
    data = cursor.execute(f'SELECT * FROM {db} WHERE {where}=(?)',(params,)).fetchall()
    connection.close()
    if data:
        data_list = [dict(row) for row in data]
        return data_list
    else:
        return None
    
    
def delete_with_id(db, id):
    connection = get_connection()
    cursor = connection.cursor()
    data = cursor.execute(f'SELECT * FROM {db} WHERE id=(?)',(id,)).fetchone()
    if data:
        cursor.execute(f'DELETE FROM {db} WHERE id=(?)', (id,))
        connection.commit()
        connection.close()
        return "Success"
    else:
        connection.close()
        return "ID not found !"