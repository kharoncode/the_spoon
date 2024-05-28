import methods

def update_restaurant(id, name, address, phone, cuisine):
    connection = methods.get_connection()
    cursor = connection.cursor()
    cursor.execute('UPDATE restaurants SET name=(?), address=(?), phone=(?), cuisine=(?) WHERE id=(?)',(name, address,phone,cuisine,id,))
    connection.commit()
    restaurant = methods.get_all('restaurants')
    connection.close()
    return restaurant