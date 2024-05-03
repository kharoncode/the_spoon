import methods

# OPENING
def update_openingTime(data_list):
    connection = methods.get_connection()
    cursor = connection.cursor()
    for day_time in data_list :
        cursor.execute('''
                       UPDATE openingTime 
                       SET start_time=(?), end_time=(?), content=(?) 
                       WHERE id=(?)
                       ''', (day_time['start_time'],day_time['end_time'],day_time['content'],day_time['id'],))
    connection.commit()
    connection.close()

    return get_openingTime_for_each_days()

def get_openingTime_days_list():
    connection = methods.get_connection()
    cursor = connection.cursor()
    day_list = cursor.execute('''
            SELECT dotw.id
            FROM daysOfTheWeek dotw
            JOIN openingTime ot 
            ON dotw.id = ot.day_id
            WHERE ot.content = 'closed'
        ''').fetchall()
    list_raw = [dict(row) for row in day_list]
    list = []
    filterd_list = []
    for row in list_raw :
        if row['id'] in list:
            if row['id'] == 7:
                filterd_list.append(0)
            else :
                filterd_list.append(row['id'])
        else :
            list.append(row['id'])
    return filterd_list
    
def get_day_openingTime(day_id):
    connection = methods.get_connection()
    cursor = connection.cursor()
    day_data = cursor.execute('''
            SELECT ot.start_time, ot.end_time, ot.content, ot.day_time
            FROM openingTime ot
            JOIN daysOfTheWeek dotw 
            ON dotw.id = ot.day_id
            WHERE dotw.id=(?)
        ''', (day_id,)).fetchall()
    list = []
    for row in day_data:
        for i in range(row['start_time'],row['end_time']-15,15):
            list.append(i)
    # day_data_list = [dict(row) for row in day_data]
    connection.close()
    return list

def get_openingTime_for_each_days():
    connection = methods.get_connection()
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

# def get_dict_days():
#     connection = methods.get_connection()
#     cursor = connection.cursor()
#     days_list = cursor.execute('SELECT * FROM daysOfTheWeek').fetchall()
#     dict_list = {}
#     for row in days_list:
#         dict_list[row['id']]=row['name']
#     connection.close()
#     return dict_list