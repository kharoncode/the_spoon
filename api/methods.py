import sqlite3

def get_connection():
    connection = sqlite3.connect('db_spoon.sqlite')
    connection.row_factory = sqlite3.Row
    return connection

def init():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    cursor.execute("CREATE TABLE IF NOT EXISTS tables (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, size INTEGER NOT NULL);")
    # cursor.execute("DROP TABLE daysOfTheWeek;")
    cursor.execute("CREATE TABLE IF NOT EXISTS daysOfTheWeek (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    
    cursor.execute("CREATE TABLE IF NOT EXISTS openingTime (id INTEGER PRIMARY KEY, day_id INTEGER, start_time TEXT, end_time TEXT, FOREIGN KEY (day_id) REFERENCES daysOfTheWeek(id));")
    cursor.execute("CREATE TABLE IF NOT EXISTS booking (id INTEGER PRIMARY KEY, user_id INTEGER, table_id INTEGER, date TIMESTAMP, customers_nbr INTEGER, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (table_id) REFERENCES tables(id))")

    # cursor.execute("INSERT INTO tables (name, size) VALUES ('petit',2), ('moyen',4), ('gros',5);")
    # cursor.execute("INSERT INTO daysOfTheWeek (name) VALUES ('lundi'), ('mardi'), ('mercredi'), ('jeudi'),('vendredi'), ('samedi'),('dimanche');")
    # cursor.execute("INSERT INTO openingTime (day_id, start_time, end_time) VALUES (1, '11:00', '14:00'), (1, '18:00', '21:00'),(2, '11:00', '14:00'), (2, '18:00', '21:00'),(3, '11:00', '14:00'), (3, '18:00', '21:00'),(4, '11:00', '14:00'), (4, '18:00', '21:00'),(5, '11:00', '14:00'), (5, '18:00', '21:00'),(6, '11:00', '14:00'), (6, '18:00', '21:00'),(7, '11:00', '14:00'), (7, '18:00', '21:00');")
    # connection.commit()


def get_all(db):
    connection = get_connection()
    cursor = connection.cursor()
    users = cursor.execute(f'SELECT * FROM {db}').fetchall()
    users_list = [dict(row) for row in users]
    return users_list


def get_one_with_params(db, where, params):
    connection = get_connection()
    cursor = connection.cursor()
    data = cursor.execute(f'SELECT * FROM {db} WHERE {where}=(?)',(params,)).fetchone()
    if data:
        return dict(data)
    else:
        return None
    
def get_all_with_params(db, where, params):
    connection = get_connection()
    cursor = connection.cursor()
    data = cursor.execute(f'SELECT * FROM {db} WHERE {where}=(?)',(params,)).fetchall()
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
        return "Success"
    else:
        return "ID not found !"

    
# USERS
def add_user(name):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE name=(?)',(name,)).fetchone()
    if not user:
        cursor.execute('INSERT INTO users (name) VALUES (?)', (name,))
        connection.commit()
        return 'Success'
    else:
        return "The user name is already in use"

def update_user(id,name):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id=(?)',(id,)).fetchone()
    if user:
        new_name = cursor.execute('SELECT * FROM users WHERE name=(?)',(name,)).fetchone()
        if not new_name :
            cursor.execute('UPDATE users SET name=(?) WHERE id=(?)', (name,id,))
            connection.commit()
            return "Success"
        else :
            return "NameNotNull"
    else:
        return None

# TABLES
def add_table(name,size):
    connection = get_connection()
    cursor = connection.cursor()
    table = cursor.execute('SELECT * FROM tables WHERE name=(?)',(name,)).fetchone()
    if not table:
        cursor.execute('INSERT INTO tables (name,size) VALUES (?,?)', (name,size,))
        connection.commit()
        return 'Success'
    else:
        return None

def update_table(id,name,size):
    connection = get_connection()
    cursor = connection.cursor()
    table = cursor.execute('SELECT * FROM tables WHERE id=(?)',(id,)).fetchone()
    if table:
        new_name = cursor.execute('SELECT * FROM tables WHERE name=(?)',(name,)).fetchone()
        if not new_name:
            cursor.execute('UPDATE tables SET name=(?), size=(?) WHERE id=(?)', (name,size,id,))
            connection.commit()
            return "Success"
        else:
            return "NameNotNull"
    else:
        return None

# OPENING
# def add_openingTime(name,size):
#     connection = get_connection()
#     cursor = connection.cursor()
#     table = cursor.execute('SELECT * FROM tables WHERE name=(?)',(name,)).fetchone()
#     if not table:
#         cursor.execute('INSERT INTO tables (name,size) VALUES (?,?)', (name,size,))
#         connection.commit()
#         return 'Success'
#     else:
#         return None

# def update_openingTime(id,name,size):
#     connection = get_connection()
#     cursor = connection.cursor()
#     table = cursor.execute('SELECT * FROM tables WHERE id=(?)',(id,)).fetchone()
#     if table:
#         new_name = cursor.execute('SELECT * FROM tables WHERE name=(?)',(name,)).fetchone()
#         if not new_name:
#             cursor.execute('UPDATE tables SET name=(?), size=(?) WHERE id=(?)', (name,size,id,))
#             connection.commit()
#             return "Success"
#         else:
#             return "NameNotNull"
#     else:
#         return None
    
def get_day_openingTime(day_id):
    connection = get_connection()
    cursor = connection.cursor()
    day_data = cursor.execute('''
            SELECT ot.start_time, ot.end_time
            FROM openingTime ot
            JOIN daysOfTheWeek dotw 
            ON dotw.id = ot.day_id
            WHERE dotw.id=(?)
        ''', (day_id,)).fetchall()
    
    day_data_list = [dict(row) for row in day_data]
    return day_data_list

def get_openingTime_for_each_days():
    connection = get_connection()
    cursor = connection.cursor()
    days_data = cursor.execute('''
            SELECT dotw.name, ot.start_time, ot.end_time
            FROM daysOfTheWeek dotw
            JOIN openingTime ot 
            ON dotw.id = ot.day_id
        ''').fetchall()
    days_list = {
            "lundi": [],
            "mardi": [],
            "mercredi": [],
            "jeudi": [],
            "vendredi": [],
            "samedi": [],
            "dimanche": []
        }
    
    for row in days_data:
        name, start_time, end_time = row
        days_list[name].append({start_time:start_time,end_time:end_time})
    return days_list