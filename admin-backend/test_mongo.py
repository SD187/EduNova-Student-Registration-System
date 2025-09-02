from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
client.admin.command('ping')
print('MongoDB works!')
