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

def apify_call(csvFile):
    
    # Original Code for scheduling tasks

    client = ApifyClient(os.getenv("API_KEY_PROD"))
    citynumber = datetime.now().date().day - 1

    jobDF = pd.read_csv(csvFile)
    jobDF.dropna(inplace=True)

    jobs = list(jobDF['General Fields'])
    cities = list(jobDF['Cities'])

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
            cursor.execute('''INSERT INTO jobs (vendorID, 
                                                positionName, 
                                                company, 
                                                location, 
                                                searchArea, 
                                                searchTerm, 
                                                scrapedAt,  
                                                postedAt, 
                                                salary, 
                                                benefits, 
                                                requirements, 
                                                description,
                                                indeedLink) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''', 
                            (i['id'],  i['positionName'], i['company'], i['location'], job, cities[citynumber], i['scrapedAt'], None, i['salary'], None, None, i['description'], i['url'])
            )
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

        
