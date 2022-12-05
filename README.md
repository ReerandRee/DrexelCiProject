# Apify
Using Apify, we are able to use an API that scraps the Indeed jobs website. 
The code in Apify.py current iterates through a list of jobs and a list of cities, calling the worker job with each combination separately. All of the results are written to a csv file with data that will need to be uploaded to our database.

## API Key
For the program to work, you will need an API key. To protect the key that we attain from Apify, please do the following...
1. Create a file `env.json`
2. Put the following code in the file. Replacing the api key as necessary.
```
{
    "api_key": "apify_api_put_key_here"
}
```
Note: gitignore will ensure that the API key does not get pushed to the master branch by accident