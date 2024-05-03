import methods
import opening_times_methods
from datetime import datetime
import time

# BOOKING
def delete_pending_booking(id):
    time.sleep(60)
    booking = methods.get_one_with_params("booking", "id", id)
    if booking :
        if booking['status'] == 'pending':
            methods.delete_with_id('booking', id)
            return 'time_out'
        else :
            return 'validate'
    return None

def add_booking(user_id, user_name, table_id, table_size, date,customers_nbr,status):
    connection = methods.get_connection()
    cursor = connection.cursor()
    isUser = methods.get_one_with_params('users', 'id', user_id)
    isTableSize = cursor.execute('SELECT * FROM tables WHERE id=(?) AND size>=(?)',(table_id,customers_nbr,)).fetchone()
    if isUser and isTableSize and is_booking_available(user_id,table_id,date):
        cursor.execute('''INSERT INTO booking 
                       (user_id, 
                       user_name, 
                       table_id, 
                       table_size,
                       date, 
                       customers_nbr, 
                       status, 
                       current_date) 
                       VALUES (?,?,?,?,?,?,?,?)''', (user_id, user_name, table_id,table_size,date,customers_nbr,status,datetime.now().strftime("%d/%m/%Y à %H:%M"),))
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

def update_booking_with_id(id,table_id, table_size, date,customers_nbr,status):
    connection = methods.get_connection()
    cursor = connection.cursor()
    isTableSize = cursor.execute('SELECT * FROM tables WHERE id=(?) AND size>=(?)',(table_id,customers_nbr,)).fetchone()
    booking = cursor.execute('SELECT * FROM booking WHERE id=(?)',(id,)).fetchone()
    if booking :
            if isTableSize:
                cursor.execute('''
                               UPDATE booking 
                               SET table_id=(?),table_size=(?), date=(?), customers_nbr=(?), status=(?) 
                               WHERE id=(?)
                               ''', (table_id,table_size, date,customers_nbr,status,id,))
                connection.commit()
                connection.close()
                return "Success"
            else:
                connection.close()
                return "TooSmall"
    else:
        connection.close()
        return None
    
# def tables_occupied_for_date(date):
#     connection = methods.get_connection()
#     cursor = connection.cursor()
#     table = cursor.execute('SELECT table_id FROM booking WHERE date>(?) AND date<(?);',(date-5400000,date+5400000)).fetchall()
#     connection.close()
#     table_list = [dict(row) for row in table]
#     return table_list

def is_fullDate_valide(date):
    connection = methods.get_connection()
    cursor = connection.cursor()
    day = datetime.fromtimestamp(date/1000).weekday()+1
    hour_list = opening_times_methods.get_day_openingTime(day)
    tables_list_raw = cursor.execute('SELECT * FROM tables').fetchall()
    tables_occupied_list_raw = cursor.execute('SELECT table_size, date FROM booking WHERE date>(?) AND date<(?);',(date,date+86400000)).fetchall()
    connection.close()
    tables_list = []
    for row in tables_list_raw:
        tables_list.append(row['id'])
    tables_occupied_list = {}
    result = {}
    for row in hour_list :
        tables_occupied_list[row*60000+date] = []
        result[row*60000+date] = False
    for row in tables_occupied_list_raw:
        if row['date'] in tables_occupied_list.keys() :
            tables_occupied_list[row['date']].append(row['table_size'])
    for key in tables_occupied_list :
        if len(tables_occupied_list[key]) == len(tables_list):
            for i in range(key-5400000,key+5400000,900000):
                if(i in result) :
                    result[i] = True
    return result

def is_booking_available(user_id,table_id,date):
    connection = methods.get_connection()
    cursor = connection.cursor()
    isTable = cursor.execute('SELECT * FROM booking WHERE table_id=(?) AND date>(?) AND date<(?);',(table_id,date-5400000,date+5400000)).fetchall()
    isUser = cursor.execute('SELECT * FROM booking WHERE user_id=(?) AND date>(?) AND date<(?);',(user_id,date-5400000,date+5400000)).fetchall()
    connection.close()
    if len(isTable)>0 or len(isUser)>0:
        return False
    else:
        return True
    
def delete_booking_with_date(date):
    connection = methods.get_connection()
    cursor = connection.cursor()
    data = cursor.execute('SELECT * FROM booking WHERE date=(?)',(date,)).fetchone()
    if data:
        cursor.execute(f'DELETE FROM booking WHERE date=(?)', (date,))
        connection.commit()
        connection.close()
        return "Success"
    else:
        connection.close()
        return "ID not found !"