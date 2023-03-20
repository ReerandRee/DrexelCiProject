import psycopg2 
import os
from dotenv import load_dotenv
import timeit
import re

def isNaN(num):
    return num != num

load_dotenv()

host = os.getenv("DB_HOST")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
port = os.getenv("DB_PORT")

rowValues=  {}

def initializeRowValues ():
    values = ["id", "vendorid", "positionname", "company", "location", "searchterm", "searcharea", "scrapedat", "createdat", "postedat", "salary", "benefits", "requirements", "description", "indeedlink", "keywords", "parsed_salary"]
    for i in range(len(values)):
        rowValues[values[i]] = i

initializeRowValues()

def processData(listOfMoney):
    # We are averaging the salary
    if len(listOfMoney) == 1:
        return listOfMoney[0]
    else:
        sumVal = float(listOfMoney[0]) + float(listOfMoney[1])
        theMoney = sumVal/2
        return theMoney


def getHrPayFromString(string):
    if (isNaN(string)):
        print("It is not a valid value")
        return None
    else:
        monthMatch = re.search(r'\bmonth\b', string)
        yearMatch = re.search(r'\byear\b', string)
        weekMatch = re.search(r'\bweek\b', string)
        dollarmatches = re.findall(r'\$[\d,]+(?:-\$[\d,]+)?', string)
        realDollar = [dollar.replace('$', '') for dollar in dollarmatches]
        realDollar = [dollar.replace(',', '') for dollar in realDollar]
        theList = []
        if monthMatch:
            for ele in realDollar:
                theList.append(float(float(ele) * 12))
        elif yearMatch:
            for ele in realDollar:
                theList.append(float(ele))
        elif weekMatch:
            for ele in realDollar:
                theList.append(float(float(ele)*52))
        else:
            for ele in realDollar:
                theList.append(float(float(ele)*40*52))
        return processData(theList)

try: 
    conn = psycopg2.connect(dbname=db, user=user, password=password, host=host, port=port)
    cursor = conn.cursor() 
except:
    print("Failed to connect to database. Please try again.")

try:
    cursor.execute("SELECT * from jobs where parsed_salary is NULL and salary is NOT NULL limit 1000")
    records = cursor.fetchall()
except:
    print("Failed to retrieve record from database. Please try again.")

for row in records:
    salary = row[rowValues["salary"]]
    id = row[rowValues["id"]]
    parsed_salary = getHrPayFromString(salary)

    try:
        cursor.execute('''
            UPDATE jobs 
            SET parsed_salary = %s
            WHERE id = %s''', (parsed_salary, id)
        )
        print('''UPDATED id = %s, salary = %s with parsed_salary = %d''', (salary, id, parsed_salary))
        conn.commit()
    except:
        print("Failed to update record from database. Please try again. ID: %s, Salary: %s", (row[rowValues["id"]], row[rowValues["salary"]]))

cursor.close()
conn.close()