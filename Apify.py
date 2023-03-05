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
    # jobs = ["Computer Science", "Data Science","Cyber Security","Software Engineering", "Web Developer"]

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
                postedat = parse_posted_at(i['postedAt'])
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
                                                    indeedLink) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''', 
                                (i['id'],  i['positionName'], i['company'], i['location'], job, cities[citynumber], i['scrapedAt'], postedat, i['salary'], None, None, i['description'], i['url']))
            except:
                print("Error inserting job id: " + i['id'])
            conn.commit()


        print(str(len(jsonOutput)) + " jobs inserted.")

    cursor.close()
    conn.close()

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

    apify_call('job.csv')
    # schedule.every().day.do(apify_call('job.csv'))
    # while True:
    #     schedule.run_pending()

#     schedule.every(1).second.do(LeesCode, "job.csv")
# # schedule.every().day.do(LeesCode, "job.csv")

#     while (i != 30):
#         timeit.timeit()

        
