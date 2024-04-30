import sqlite3
from datetime import datetime
import time

def get_connection():
    connection = sqlite3.connect('db_spoon.sqlite')
    connection.row_factory = sqlite3.Row
    return connection

def init():
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    cursor.execute("CREATE TABLE IF NOT EXISTS tables (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, size INTEGER NOT NULL);")
    cursor.execute("CREATE TABLE IF NOT EXISTS daysOfTheWeek (id INTEGER PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE);")
    # cursor.execute("DROP TABLE booking;")
    cursor.execute("CREATE TABLE IF NOT EXISTS openingTime (id INTEGER PRIMARY KEY, day_id INTEGER, day_time VARCHAR(20), start_time INTEGER, end_time INTEGER, content VARCHAR(20), FOREIGN KEY (day_id) REFERENCES daysOfTheWeek(id));")
    cursor.execute("CREATE TABLE IF NOT EXISTS booking (id INTEGER PRIMARY KEY, user_id INTEGER, user_name VARCHAR(20), table_id INTEGER, date TIMESTAMP, customers_nbr INTEGER, status VARCHAR(15), current_date DATE, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (table_id) REFERENCES tables(id))")
    
    # cursor.execute("INSERT INTO tables (name, size) VALUES ('petit',2), ('moyen',4), ('gros',5);")
    # cursor.execute("INSERT INTO daysOfTheWeek (name) VALUES ('lundi'), ('mardi'), ('mercredi'), ('jeudi'),('vendredi'), ('samedi'),('dimanche');")
    # cursor.execute("INSERT INTO openingTime (day_id, day_time, start_time, end_time, content) VALUES (1, 'lunch', 660, 840, '11:00-14:00'), (1, 'dinner', 660, 1260, '18:00-21:00'),(2, 'lunch', 660, 840, '11:00-14:00'), (2, 'dinner', 660, 1260, '18:00-21:00'),(3, 'lunch', 660, 840, '11:00-14:00'), (3, 'dinner', 660, 1260, '18:00-21:00'),(4, 'lunch', 660, 840, '11:00-14:00'), (4, 'dinner', 660, 1260, '18:00-21:00'),(5, 'lunch', 660, 840, '11:00-14:00'), (5, 'dinner', 660, 1260, '18:00-21:00'),(6, 'lunch', 660, 840, '11:00-14:00'), (6, 'dinner', 660, 1260, '18:00-21:00'),(7, 'lunch', 0, 0, 'closed'),(7, 'dinner', 0, 0, 'closed');")
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

    
# USERS
def add_user(name):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE name=(?)',(name,)).fetchone()
    if not user:
        cursor.execute('INSERT INTO users (name) VALUES (?)', (name,))
        connection.commit()
        connection.close()
        return {"status":"success","id":cursor.lastrowid}
    else:
        connection.close()
        return {"status":"error","message":"The user name is already in use"}

def update_user(id,name):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id=(?)',(id,)).fetchone()
    if user:
        new_name = cursor.execute('SELECT * FROM users WHERE name=(?)',(name,)).fetchone()
        if not new_name :
            cursor.execute('UPDATE users SET name=(?) WHERE id=(?)', (name,id,))
            connection.commit()
            connection.close()
            return "Success"
        else :
            connection.close()
            return "NameNotNull"
    else:
        connection.close()
        return None 

def get_user_information(id):
    connection = get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id=(?)', (id,)).fetchone()
    if user:
        user_info_raw = cursor.execute('''
            SELECT u.id AS user_id, u.name AS user_name, b.id AS booking_id, b.table_id, b.date, b.customers_nbr, b.status, b.current_date
            FROM users u
            JOIN booking b 
            ON u.id = b.user_id
            WHERE u.id = ?
            ''', (id,)).fetchall()
        
        if user_info_raw:
            user_info = {
                'user_id': user_info_raw[0]['user_id'],
                'user_name': user_info_raw[0]['user_name'],
                'bookings': [],
                'bookings_list':[]
            }
            for row in user_info_raw:
                booking_info = {
                    'booking_id': row['booking_id'],
                    'table_id': row['table_id'],
                    'date': row['date'],
                    'customers_nbr': row['customers_nbr'],
                    'status': row['status'],
                    'current_date': row['current_date'],
                    'test':row['user_name']
                }
                user_info['bookings'].append(booking_info)
                user_info['bookings_list'].append(row['date'])
            
            connection.close()
            return user_info
        else:
            user_info = {
                'user_id': user['id'],
                'user_name': user['name'],
                'bookings': [],
                'bookings_list':[]
            }
            connection.close()
            return user_info
    else:
        connection.close()
        return "User not found"

        

# TABLES
def add_table(name,size):
    connection = get_connection()
    cursor = connection.cursor()
    table = cursor.execute('SELECT * FROM tables WHERE name=(?)',(name,)).fetchone()
    if not table:
        cursor.execute('INSERT INTO tables (name,size) VALUES (?,?)', (name,size,))
        connection.commit()
        connection.close()
        return 'Success'
    else:
        connection.close()
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
            connection.close()
            return "Success"
        else:
            connection.close()
            return "NameNotNull"
    else:
        connection.close()
        return None

def get_tables_information(date):
    connection = get_connection()
    cursor = connection.cursor()
    tables_info_raw = cursor.execute('''
        SELECT t.id AS table_id, t.name AS table_name, t.size AS table_size, b.id AS booking_id, b.date, b.user_id, b.customers_nbr, b.status, b.current_date
        FROM tables t
        JOIN booking b 
        ON t.id = b.table_id
        WHERE b.date > (?) AND b.date <(?)
        ''', (date-5400000,date+5400000)).fetchall();
    table_list_raw = cursor.execute('SELECT * FROM tables ORDER BY size ASC')
    tables_info = {}
    for row in table_list_raw:
        tables_info[row['id']]={'table_id':row['id'],"table_name":row['name'],'table_size': row['size'],"bookings":[]}
    for row in tables_info_raw:
        table_id = row['table_id']
        booking_info = {
            'booking_id': row['booking_id'],
            'date': row['date'],
            'customers_nbr': row['customers_nbr'],
            'status': row['status'],
            'current_date': row['current_date'],
            'user_id': row['user_id']
        }
        tables_info[table_id]['bookings'].append(booking_info)
    
    connection.close()
    return list(tables_info.values())

# OPENING
def update_openingTime(data_list):
    connection = get_connection()
    cursor = connection.cursor()
    for day_time in data_list :
        cursor.execute('UPDATE openingTime SET start_time=(?), end_time=(?), content=(?) WHERE id=(?)', (day_time['start_time'],day_time['end_time'],day_time['content'],day_time['id'],))
    connection.commit()
    connection.close()

    return get_openingTime_for_each_days()

def get_openingTime_days_list():
    connection = get_connection()
    cursor = connection.cursor()
    day_list = cursor.execute('''
            SELECT dotw.id
            FROM daysOfTheWeek dotw
            JOIN openingTime ot 
            ON dotw.id = ot.day_id
            WHERE ot.content = 'closed'
        ''').fetchall()
    list = [dict(row) for row in day_list]
    return list
    
def get_day_openingTime(day_id):
    connection = get_connection()
    cursor = connection.cursor()
    day_data = cursor.execute('''
            SELECT ot.start_time, ot.end_time, ot.content, ot.day_time
            FROM openingTime ot
            JOIN daysOfTheWeek dotw 
            ON dotw.id = ot.day_id
            WHERE dotw.id=(?)
        ''', (day_id,)).fetchall()
    day_data_list = [dict(row) for row in day_data]
    connection.close()
    return day_data_list

def get_openingTime_for_each_days():
    connection = get_connection()
    cursor = connection.cursor()
    days_data = cursor.execute('''
            SELECT dotw.name, ot.start_time, ot.end_time, ot.content, ot.day_time, ot.id
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
        name, start_time, end_time, content, day_time, id = row
        days_list[name].append({"start_time":start_time,"end_time":end_time, "content":content, "day_time":day_time, "id":id})
    connection.close()
    return days_list

def get_dict_days():
    connection = get_connection()
    cursor = connection.cursor()
    days_list = cursor.execute('SELECT * FROM daysOfTheWeek').fetchall()
    dict_list = {}
    for row in days_list:
        dict_list[row['id']]=row['name']
    connection.close()
    return dict_list


# BOOKING
def delete_pending_booking(id):
    time.sleep(60)
    booking = get_one_with_params("booking", "id", id)
    if booking['status'] == 'pending':
        delete_with_id('booking', id)
        return 'time_out'
    else :
        return 'validate'

def add_booking(user_id, user_name, table_id,date,customers_nbr,status):
    connection = get_connection()
    cursor = connection.cursor()
    isUser = get_one_with_params('users', 'id', user_id)
    isTableSize = cursor.execute('SELECT * FROM tables WHERE id=(?) AND size>=(?)',(table_id,customers_nbr,)).fetchone()
    if isUser and isTableSize and is_booking_available(user_id,table_id,date):
        cursor.execute('INSERT INTO booking (user_id, user_name, table_id, date, customers_nbr, status, current_date) VALUES (?,?,?,?,?,?,?)', (user_id, user_name, table_id,date,customers_nbr,status,datetime.now(),))
        connection.commit()
        if status == 'pending':
            result = delete_pending_booking(cursor.lastrowid)
            if result == 'time_out' :
                connection.close()
                return {"status":'time_out',"message":f'Booking #{cursor.lastrowid} is time_out'}
            else :
                connection.close()
                return {"status":"success","message":f'Booking #{cursor.lastrowid}'} 
        else :
            connection.close()
            return {"status":"success","message":f'Booking #{cursor.lastrowid} is {status}'}
    else:
        connection.close()
        return {"status":"invalid","message":'The reservation is not valid'}

def update_booking_with_id(id,table_id,date,customers_nbr,status):
    connection = get_connection()
    cursor = connection.cursor()
    isTableSize = cursor.execute('SELECT * FROM tables WHERE id=(?) AND size>=(?)',(table_id,customers_nbr,)).fetchone()
    booking = cursor.execute('SELECT * FROM booking WHERE id=(?)',(id,)).fetchone()
    if booking :
            if isTableSize:
                cursor.execute('UPDATE booking SET table_id=(?), date=(?), customers_nbr=(?), status=(?) WHERE id=(?)', (table_id,date,customers_nbr,status,id,))
                connection.commit()
                connection.close()
                return "Success"
            else:
                connection.close()
                return "TooSmall"
    else:
        connection.close()
        return None
    
def tables_occupied_for_date(date):
    connection = get_connection()
    cursor = connection.cursor()
    table = cursor.execute('SELECT table_id FROM booking WHERE date>(?) AND date<(?);',(date-5400000,date+5400000)).fetchall()
    connection.close()
    table_list = [dict(row) for row in table]
    return table_list

def is_booking_available(user_id,table_id,date):
    connection = get_connection()
    cursor = connection.cursor()
    isTable = cursor.execute('SELECT * FROM booking WHERE table_id=(?) AND date>(?) AND date<(?);',(table_id,date-5400000,date+5400000)).fetchall()
    isUser = cursor.execute('SELECT * FROM booking WHERE user_id=(?) AND date>(?) AND date<(?);',(user_id,date-5400000,date+5400000)).fetchall()
    connection.close()
    if len(isTable)>0 or len(isUser)>0:
        return False
    else:
        return True