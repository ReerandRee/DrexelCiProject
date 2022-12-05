# Senior Project: Data Visualization

## Front End
The front end of our project is hosted locally on port 3000 [http://localhost:3000](http://localhost:3000) using the React framework. This code is stored on the `rl-frontend` branch.


To run the development server:

```
cd ./frontend
npm install
npm run dev

```

## Manual Webscraping
The manual webscraper is currently run on a juypter notebook. The program selects the ability to sort the job posting by data, making it simpler for sorting and gathering new data. The webscraping is using a webdriver from the selenium library to nagivate through various Indeed website page to attain job postings. The various job postings can be scraped for their Indeed vendorid that allows us to nagivate to the job posting's individual page and attain more data. 

## Apify
Using Apify, we are able to use an API that scraps the Indeed jobs website. 
The code in Apify.py current iterates through a list of jobs and a list of cities, calling the worker job with each combination separately. All of the results are written to a csv file with data that will need to be uploaded to our database. This code is stored on the `Apify` branch.