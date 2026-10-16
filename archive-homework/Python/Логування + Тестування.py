#    //   / /
#   //___         __        ___         __     __  ___     ___        ___     __  ___  __  ___
#  / ___        //  ) )   //   ) )   //   ) )   / /      //   ) )   ((   ) )   / /      / /
# //           //        //   / /   //   / /   / /      //   / /     \ \      / /      / /
#//           //        ((___/ /   //   / /   / /      ((___( (   //   ) )   / /      / /

import logging

#Ex.1
from datetime import datetime

logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

current_date = datetime.now().strftime('%Y-%m-%d')

logging.info(f'Поточна дата: {current_date}')



#Ex.2

logging.basicConfig(filename='app.log', level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

try:
    result = 10 / 0
except Exception as e:
    logging.error(f'Виникла помилка: {e}')



#Ex.3
def login(username, password):
    correct_username = 'admin'
    correct_password = 'password123'
    
    try:
        assert username == correct_username and password == correct_password, "Невірне ім'я користувача або пароль"
        print("Вхід виконано успішно")
    except AssertionError as e:
        print(e)

login('admin', 'password123')  
login('user', 'password')      