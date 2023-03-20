import schedule
import time
import timeit
from apify_client import ApifyClient
from datetime import datetime
import pandas as pd
import json
import psycopg2
import os
from dotenv import load_dotenv
import re
import math

load_dotenv()

host = os.getenv("DB_HOST")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
port = os.getenv("DB_PORT")


def isNaN(num):
    return num != num


def processData(listOfMoney):
    # We are averaging the salary
    if len(listOfMoney) == 1:
        return listOfMoney[0]
    else:
        sumVal = float(listOfMoney[0]) + float(listOfMoney[1])
        theMoney = sumVal/2
        return theMoney


'''
    getHrPayFromString(string)
    input: the string of the cell value
    output: the average salary per year
'''


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


def getHrPay(listOfPreviousSalaryInfo):
    theNewList = []
    for string in listOfPreviousSalaryInfo:
        if (isNaN(val)):
            theNewList.append("")
            continue
        else:
            monthMatch = re.search(r'\bmonth\b', val)
            yearMatch = re.search(r'\byear\b', val)
            hourMatch = re.search(r'\bhour\b', val)
            weekMatch = re.search(r'\bweek\b', val)
            dollarmatches = re.findall(r'\$[\d,]+(?:-\$[\d,]+)?', val)

            realDollar = [dollar.replace('$', '') for dollar in dollarmatches]
            realDollar = [dollar.replace(',', '') for dollar in realDollar]
            if monthMatch:
                theList = []
                for ele in realDollar:
                    theList.append(float(float(ele) * 12))
                theNewList.append(processData(theList))
            elif yearMatch:
                theList = []
                for ele in realDollar:
                    theList.append(float(ele))
                theNewList.append(processData(theList))
            elif weekMatch:
                theList = []
                for ele in realDollar:
                    theList.append(float(float(ele)*52))
                theNewList.append(processData(theList))
            else:
                theList = []

                for ele in realDollar:
                    theList.append(float(float(ele)*40*52))
                theString = processData(theList)
                theNewList.append(theString)
                
    return theNewList
            
try: 
    conn = psycopg2.connect(dbname=db, user=user, password=password, host=host, port=port)
    cursor = conn.cursor() 
except:
    print("Failed to connect to database. Please try again.")

def apify_call(csvFile, citynumber = -1):
    
    # Original Code for scheduling tasks

    client = ApifyClient(os.getenv("API_KEY_PROD"))
    if citynumber == -1:
        citynumber = datetime.now().date().day - 1

    jobDF = pd.read_csv(csvFile)
    jobDF.dropna(inplace=True)

    jobs = list(jobDF['General Fields'])
    cities = list(jobDF['Cities'])

    #MANUAL OVERRIDE
    # jobs = jobs[23:]

    for job in jobs:
        print(job, cities[citynumber])
        now = datetime.now()  # current date and time
        date_time = now.strftime("%m-%d-%Y %H_%M")
        filename = job + "-" + cities[citynumber] + date_time
        run_input = {
            "position": job,
            "country": "US",
            "location": cities[citynumber],
            "maxItems": 150,
            "maxConcurrency": 5,
            "extendOutputFunction": """($) => {
                const result = {};

                """ + f"result.title = \"{filename}\";" + """

                return result;
                }""",
            "proxyConfiguration": {"useApifyProxy": True},
        }
        # print(run_input)
        # # Run the actor and wait for it to finish
        run = client.actor("hynekhruska/indeed-scraper").call(run_input=run_input)

    # Fetch and print actor results from the run's dataset (if there are any)
    # f = open(f"outputschedule/{filename}.txt", "wb")
    # Download_Items should be deprecated but its still working? and its new replacement isnt working.
        outputbytes = client.dataset(
            run["defaultDatasetId"]).download_items(item_format='json')

        jsonOutput = json.loads(outputbytes)

        for i in jsonOutput:
            # cursor.execute("INSERT INTO demo_jobs (id, company, position, location) VALUES (%s, %s, %s, %s)", (i['id'], i['company'], i['positionName'], i['location']))
            try:
                cursor.execute('''INSERT INTO jobs (vendorID, 
                                                    positionName, 
                                                    company, 
                                                    location, 
                                                    searchTerm,
                                                    searchArea,  
                                                    scrapedAt,  
                                                    postedAt, 
                                                    salary, 
                                                    benefits, 
                                                    requirements, 
                                                    description,
                                                    indeedLink, 
                                                    parsed_salary) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''', 
                                (i['id'],  i['positionName'], i['company'], i['location'], job, cities[citynumber], i['scrapedAt'], None, i['salary'], None, None, i['description'], i['url'], getHrPayFromString(i['salary'])))
            except:
                print("Error inserting job id: " + i['id'])
            conn.commit()


        print(str(len(jsonOutput)) + " jobs inserted.")

    cursor.close()
    conn.close()

    # f.write(outputbytes)
    # f.close()


if __name__ == "__main__":

    apify_call('job.csv')
    # schedule.every().day.do(apify_call('job.csv'))
    # while True:
    #     schedule.run_pending()

#     schedule.every(1).second.do(LeesCode, "job.csv")
# # schedule.every().day.do(LeesCode, "job.csv")

#     while (i != 30):
#         timeit.timeit()

        
