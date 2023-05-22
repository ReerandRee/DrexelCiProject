from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchWindowException, NoSuchElementException

import psycopg2
import os
import pandas as pd
import time

from dotenv import load_dotenv
load_dotenv()

host = os.getenv("DB_HOST")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
port = os.getenv("DB_PORT")

try: 
    conn = psycopg2.connect(dbname=db, user=user, password=password, host=host, port=port)
    cursor = conn.cursor() 
except:
    print("Failed to connect to database. Please try again.")

def ScrapeJobCount(job_title_to_search: str, city: str):    
    job_title_to_search = job_title_to_search.replace(" ", "+")
    url_template = "https://www.indeed.com/jobs?q={}&l={}".format(job_title_to_search, city)

    driver.get(url_template)
    jobCount = driver.find_element(By.CLASS_NAME, "jobsearch-JobCountAndSortPane-jobCount").text
    return jobCount

options = Options()
options.headless = True
options.add_argument("--window-size=1920,1200")
driver = webdriver.Chrome(executable_path="C:/Users/mario/Desktop/School Stuff/CI/DrexelCiProject/chromedriver.exe")

#Get CSV data
titlesDF = pd.read_csv('JobSearchTitles.csv')
titlesDF.dropna(inplace=True)
citiesDF = pd.read_csv('JobSearchLocations.csv', delimiter=';')
citiesDF.dropna(inplace=True)
jobs = list(titlesDF['General Fields'])
cities = list(citiesDF['Cities'])

# print(jobs)
# print(cities)

for job in jobs:
    for city in cities:
        try:
                jobcountstr = ScrapeJobCount(job, city)
                jobcount = int(jobcountstr.split(' ')[0].replace(',', ''))
                print(jobcount, job, city)
        except Exception as e:
                print("Error inserting job: ",job, city)
                jobcount = 0

        try:
                cursor.execute('''INSERT INTO jobcounts (
                                                    searchTerm,
                                                    searchArea,  
                                                    count) VALUES (%s, %s, %s)''', 
                                (job, city, jobcount))
        except Exception as e:
                print("Error inserting job: ",job, city)
                print(e)
        conn.commit()
        
        time.sleep(5.1)

# print(jobcount)