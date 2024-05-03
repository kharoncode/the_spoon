import methods

# USERS
class user :
    def __init__(self, name):
        self.name = name

def add_user(name):
    connection = methods.get_connection()
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
    connection = methods.get_connection()
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
    connection = methods.get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE id=(?)', (id,)).fetchone()
    if user:
        user_info_raw = cursor.execute('''
            SELECT 
                u.id, 
                u.name, 
                b.id AS booking_id, 
                b.table_id, b.date, 
                b.customers_nbr, 
                b.status, 
                b.current_date
            FROM users u
            JOIN booking b 
            ON u.id = b.user_id
            WHERE u.id = ?
            ''', (id,)).fetchall()
        
        user_info = {
            'user_id': user['id'],
            'user_name': user['name'],
            'bookings': [],
            'bookings_list':[]}
        
        for row in user_info_raw:
            booking_info = {
                'booking_id': row['booking_id'],
                'table_id': row['table_id'],
                'date': row['date'],
                'customers_nbr': row['customers_nbr'],
                'status': row['status'],
                'current_date': row['current_date'],
            }
            user_info['bookings'].append(booking_info)
            user_info['bookings_list'].append(row['date'])
        
        connection.close()
        return user_info
        
    else:
        connection.close()
        return "User not found"

        
