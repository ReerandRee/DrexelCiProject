import schedule
import time
from apify_client import ApifyClient
from datetime import datetime
import pandas as pd


def LeesCode(csvFile):
	global i
	
		#Original Code for scheduling tasks

	client = ApifyClient("apify_api_yvfSEL3U0oHI5yebcMWwSW2LxwOppg4BgmRI")
	
	
	jobDF = pd.read_csv(csvFile)
	jobDF.dropna(inplace=True)
	
	jobArray2 = list(jobDF['General Fields'])
	cityArray2 = list(jobDF['Cities'])

	#jobArray = ["Computer Science","Retail Cashier","Doctor","Restuarant Server","Receptionist","Event planner","Writer","Janitor","Construction Worker","Banker"]
	#cityArray = ["New York, New York","Los Angeles, California","Chicago, Illinois","Houston, Texas","Phoenix, Arizona","Philadelphia, Pennsylvania","San Antonio, Texas","San Diego, California","Dallas, Texas","San Jose, California"]

	for job in jobArray2:
		print(job, cityArray2[i])
		'''
		now = datetime.now() # current date and time
           	date_time = now.strftime("%m-%d-%Y %H_%M")
	        filename = job + "-" + cityArray2[i]+ date_time
             	run_input = {
	                "position": job,
	                "country": "US",
	                "location": cityArray2[i],
	                "maxItems": 50,
	                "maxConcurrency": 5,
	                "extendOutputFunction": """($) => {
	                const result = {};
	
	                """ + f"result.title = \"{filename}\";" + """

	                return result;
	                }""",
	                "proxyConfiguration": { "useApifyProxy": True },
	        }
                # print(run_input)
                # # Run the actor and wait for it to finish
	        run = client.actor("hynekhruska/indeed-scraper").call(run_input=run_input)

                # Fetch and print actor results from the run's dataset (if there are any)
	        f = open(f"output/{filename}.txt", "wb")
                # Download_Items should be deprecated but its still working? and its new replacement isnt working.
	        outputbytes = client.dataset(run["defaultDatasetId"]).download_items(item_format='json')
	        f.write(outputbytes)
	        f.close()
		'''
	i += 1
	
if __name__ == "__main__":

	i = 0
	
	schedule.every(1).seconds.do(LeesCode, "job.csv")

	while (i != 30):
		schedule.run_pending()
