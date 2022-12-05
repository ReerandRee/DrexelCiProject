from datetime import datetime
from apify_client import ApifyClient
import json

with open('env.json', 'r') as file:
    env = json.load(file)

apiKey = env["api_key"]

# Initialize the ApifyClient with your API token
client = ApifyClient(apiKey)

# jobArray = ["Software Engineer","Computer Science", "Data Science"]
# cityArray = ["Philadelphia", "New York City", ]

job = input("Input a job title: ")
city = input("Input a city location: ")

now = datetime.now()  # current date and time
date_time = now.strftime("%m-%d-%Y %H_%M")
filename = job + "-" + city + date_time
run_input = {
    "position": job,
    "country": "US",
    "location": city,
    "maxItems": 50,
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
run = client.actor(
    "hynekhruska/indeed-scraper").call(run_input=run_input)

# Fetch and print actor results from the run's dataset (if there are any)
f = open(f"output/{filename}.txt", "wb")
# Download_Items should be deprecated but its still working? and its new replacement isnt working.
outputbytes = client.dataset(
    run["defaultDatasetId"]).download_items(item_format='json')
f.write(outputbytes)
f.close()
