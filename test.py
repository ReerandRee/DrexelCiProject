from apify_client import ApifyClient
from datetime import datetime

client = ApifyClient("apify_api_R6A0sqF7uqr01hfDbAtwsMZaZou4D13Y3HbR")

my_dataset_client = client.dataset('LL7vWB5ureaxVFcsk')
test = my_dataset_client.download_items(item_format='json')

f = open("output/test2.txt", "wb")
f.write(test)
f.close()
print("done")