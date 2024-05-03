import methods

# TABLES
def add_table(name,size):
    connection = methods.get_connection()
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
    connection = methods.get_connection()
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
    connection = methods.get_connection()
    cursor = connection.cursor()
    tables_info_raw = cursor.execute('''
        SELECT 
            t.id AS table_id, 
            t.name AS table_name, 
            t.size AS table_size, 
            b.id AS booking_id, 
            b.date, b.user_id, 
            b.customers_nbr, 
            b.status, 
            b.current_date
        FROM tables t
        JOIN booking b 
        ON t.id = b.table_id
        WHERE b.date > (?) AND b.date <(?)
        ''', (date-5400000,date+5400000)).fetchall();
    table_list_raw = cursor.execute('SELECT * FROM tables ORDER BY size ASC')
    tables_info = {}
    for row in table_list_raw:
        tables_info[row['id']]={'table_id':row['id'],
                                "table_name":row['name'],
                                'table_size': row['size'],
                                "bookings":[]}
    for row in tables_info_raw:
        booking_info = {
            'booking_id': row['booking_id'],
            'date': row['date'],
            'customers_nbr': row['customers_nbr'],
            'status': row['status'],
            'current_date': row['current_date'],
            'user_id': row['user_id']
        }
        tables_info[row['table_id']]['bookings'].append(booking_info)
    
    connection.close()
    return list(tables_info.values())

def max_customer(date):
    connection = methods.get_connection()
    cursor = connection.cursor()
    size_list = []
    tables_size_raw = cursor.execute('''SELECT size FROM tables''')
    for row in tables_size_raw :
        size_list.append(row['size'])
    bigger_size = max(size_list)
    tables_row = cursor.execute('''SELECT t.size AS table_size, b.date 
                                From booking b
                                JOIN tables t
                                WHERE t.size = b.table_size AND date>(?) AND date<(?)''',(date-5400000,date+5400000,))
    for row in tables_row :
        size_list.remove(row['table_size'])
    connection.close()
    return {"bigger_size":bigger_size, "max_available":max(size_list)}