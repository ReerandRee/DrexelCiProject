import schedule
import time
import timeit
from apify_client import ApifyClient
from datetime import datetime, timedelta
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

# Doesnt compile, commenting out (unused code)

# def getHrPay(listOfPreviousSalaryInfo):
#     theNewList = []
#     for string in listOfPreviousSalaryInfo:
#         if (isNaN(val)):
#             theNewList.append("")
#             continue
#         else:
#             monthMatch = re.search(r'\bmonth\b', val)
#             yearMatch = re.search(r'\byear\b', val)
#             hourMatch = re.search(r'\bhour\b', val)
#             weekMatch = re.search(r'\bweek\b', val)
#             dollarmatches = re.findall(r'\$[\d,]+(?:-\$[\d,]+)?', val)

#             realDollar = [dollar.replace('$', '') for dollar in dollarmatches]
#             realDollar = [dollar.replace(',', '') for dollar in realDollar]
#             if monthMatch:
#                 theList = []
#                 for ele in realDollar:
#                     theList.append(float(float(ele) * 12))
#                 theNewList.append(processData(theList))
#             elif yearMatch:
#                 theList = []
#                 for ele in realDollar:
#                     theList.append(float(ele))
#                 theNewList.append(processData(theList))
#             elif weekMatch:
#                 theList = []
#                 for ele in realDollar:
#                     theList.append(float(float(ele)*52))
#                 theNewList.append(processData(theList))
#             else:
#                 theList = []

#                 for ele in realDollar:
#                     theList.append(float(float(ele)*40*52))
#                 theString = processData(theList)
#                 theNewList.append(theString)
#     return theNewList
            
try: 
    conn = psycopg2.connect(dbname=db, user=user, password=password, host=host, port=port)
    cursor = conn.cursor() 
except:
    print("Failed to connect to database. Please try again.")

def apify_call(titlescsv, locationscsv, maxReads):
    
    # Original Code for scheduling tasks

    client = ApifyClient(os.getenv("API_KEY_DEV"))

    #Get CSV data
    titlesDF = pd.read_csv(titlescsv)
    titlesDF.dropna(inplace=True)
    citiesDF = pd.read_csv(locationscsv, delimiter=';')
    citiesDF.dropna(inplace=True)
    jobs = list(titlesDF['General Fields'])
    cities = list(citiesDF['Cities'])

    #Read Save File
    saveFile = open("save.txt", "r")
    titleIndex = saveFile.readline()
    titleIndex = titleIndex.split(':')

    try:
            if len(titleIndex) == 2:
                    titleIndex = int(titleIndex[1])
            else:
                titleIndex = 0
    except:
            print("Could not read Job Title Index from Save file, defualting to 0")
            titleIndex = 0

    cityIndex = saveFile.readline()        
    cityIndex = cityIndex.split(':')
    try:
            if len(cityIndex) == 2:
                    cityIndex = int(cityIndex[1])
            else:
                    cityIndex = 0
    except:
            print("Could not read City Index from Save file, defualting to 0")
            cityIndex = 0
    saveFile.close()

    #MANUAL OVERRIDE
    # jobs = ["Computer Science", "Data Science","Cyber Security","Software Engineering", "Web Developer"]
    parsedJobs = 0
    while (parsedJobs < maxReads):
        job = jobs[titleIndex]
        city = cities[cityIndex]
        print(job, city)

        now = datetime.now()  # current date and time
        date_time = now.strftime("%m-%d-%Y %H_%M")
        filename = job + "-" + city + date_time
        run_input = {
            "position": job,
            "country": "US",
            "location": city,
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
            postedat = parse_posted_at(i['postedAt'])
            try:
                parsedSalary = getHrPayFromString(i['salary'])
            except Exception as e:
                if (i['salary'] == None):
                    print("Error Parsing pay from job id: " + i['id'])
                else:
                    print("Error Parsing pay from job id: " + i['id'] + ", Pay String is: " + i['salary'])
                print(e)
                parsedSalary = None
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
                                                    keywords,
                                                    parsed_salary) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''', 
                                (i['id'],  i['positionName'], i['company'], i['location'], job, city, i['scrapedAt'], postedat, i['salary'], None, None, i['description'], i['url'], None, parsedSalary))
            except Exception as e:
                print("Error inserting job id: " + i['id'])
                print(e)
            conn.commit()


        print(str(len(jsonOutput)) + " jobs inserted.")

        parsedJobs += len(jsonOutput)

        #If we're not at the end of the file list, reset.
        titleIndex += 1
        if titleIndex >= len(jobs):
             titleIndex = 0
             cityIndex += 1
             if cityIndex >= len(cities):
                  cityIndex = 0

    cursor.close()
    conn.close()

    saveFile = open("save.txt", "w")
    saveStr = "Last Read Job Title Index : {}\nLast Read City Index : {}".format(titleIndex, cityIndex)
    saveFile.write(saveStr)
    saveFile.close()

    # f.write(outputbytes)
    # f.close()

def parse_posted_at(inputString):
    if inputString == "Just Posted":
        return datetime.today()
    if inputString == "Today":
        return datetime.today()
    daysBack = ''.join(filter(str.isdigit, inputString))
    if daysBack != "":
        try:
            return (datetime.today() - timedelta(days=int(daysBack)))
        except:
            return None
    return None; 

if __name__ == "__main__":
    apify_call('JobSearchTitles.csv', 'JobSearchLocations.csv', 10000)