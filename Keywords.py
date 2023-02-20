from keybert import KeyBERT
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

cursor.execute('''SELECT x.* FROM public.jobs x
                WHERE searchterm = 'Beauty'
                limit 100''')
records = cursor.fetchall()

# Zip it all up into one loooong string
descriptions = list(zip(*records))[13]
descStr = ' '.join(descriptions)

kw_model = KeyBERT()
keywords = kw_model.extract_keywords(descStr)

results = kw_model.extract_keywords(descStr, keyphrase_ngram_range=(1,1), top_n=10, stop_words=None)
print(results)

keywords = list(zip(*results))[0]
print(keywords)
