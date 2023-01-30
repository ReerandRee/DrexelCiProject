import schedule
import time
import timeit
from apify_client import ApifyClient
from datetime import datetime
import pandas as pd
import psycopg2 
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("DB_HOST")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
apiKey = os.getenv("API_KEY")


if __name__ == "__main__":
    try: 
        conn = psycopg2.connect(dbname=db, user=user, password=password, host=host, port=6156)
        cursor = conn.cursor()
    except:
        print("Failed to connect to database. Please try again.")

    client = ApifyClient(apiKey)

    jobDF = pd.read_csv('job.csv')
    jobDF.dropna(inplace=True)

    jobs = list(jobDF['General Fields'])
    cities = list(jobDF['Cities'])

    for job in jobs[0:1]:
        now = datetime.now()  # current date and time
        date_time = now.strftime("%m-%d-%Y %H_%M")
        filename = job + "-" + cities[0] + date_time
        run_input = {
            "position": job,
            "country": "US",
            "location": cities[0],
            "maxItems": 50,
            "maxConcurrency": 5,
            "extendOutputFunction": """($) => {
                const result = {};
            """ + f"result.title = \"{filename}\";" + """
            return result;
            }""",
        "proxyConfiguration": {"useApifyProxy": True},
        }
    run = client.actor("hynekhruska/indeed-scraper").call(run_input=run_input)

    outputbytes = client.dataset(
    run["defaultDatasetId"]).download_items(item_format='json')

    import json
    json_two = json.loads(outputbytes)

    cursor.execute(f"INSERT INTO demo_jobs2 (id, company, position, location) VALUES (%s, %s, %s, %s)", (json_two[1]['id'], json_two[1]['company'], json_two[1]['positionName'], json_two[1]['location']))
    conn.commit()