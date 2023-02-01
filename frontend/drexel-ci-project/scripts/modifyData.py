import json
import argparse
# import psycopg2

def readFile(filename):
    """Reads the file and returns the data as a list of lists"""
    data = []
    with open(filename, 'r') as f:
        data = json.loads(f.read())
    return data

def cleanData(data):
    newData = []
    for d in data:
        # location = d['location']
        # location = location.split(',')
        # if (len(location) < 2):
        #     continue

        # print(d['location'].replace(',', ' '))

        newObject = {} 
        newObject['id'] = d['id']
        # newObject['location'] = location[0] + ', ' + location[1]
        
        newObject['location'] = d['location'].replace(',', ' ')

        if ('company' not in d.keys()):
            newObject['company'] = 'None'
        else:
            newObject['company'] = d['company'].replace(',', ' ')
        newObject['searchTerm'] = d['title'].split('-')[0]
        newData.append(newObject)

    return newData



if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", help="The file input of the program")

    args = parser.parse_args()
    data = readFile(args.f)
    data = cleanData(data)

    header = ','.join(data[0].keys())

    print(header)
    for d in data:
        print(','.join(d.values()))
         
    # print(json.dumps(data))
    # readFile