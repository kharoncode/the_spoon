import methods

# USERS
class user :
    def __init__(self, firstName,lastName, mail, phone):
        self.firstName = firstName
        self.lastName = lastName
        self.mail = mail
        self.phone = phone

def add_user(firstName,lastName,mail,phone,password):
    connection = methods.get_connection()
    cursor = connection.cursor()
    user = cursor.execute('SELECT * FROM users WHERE mail=(?)',(mail,)).fetchone()
    if not user:
        cursor.execute('INSERT INTO users (firstName,lastName,mail,phone,password) VALUES (?,?,?,?,?)', (firstName,lastName,mail,phone,password,))
        connection.commit()
        connection.close()
        return {"status":"success","id":cursor.lastrowid}
    else:
        connection.close()
        return {"status":"error","message":"This Mail is already in use"}

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
                u.mail,
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
            'user_mail':user['mail'],
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

        
