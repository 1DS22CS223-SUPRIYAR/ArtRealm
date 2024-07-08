from artrealm.settings import mongo_db
import bcrypt
from datetime import datetime
from bson import ObjectId
import gridfs

def insert_user(username, email, password, first_name, last_name, bio, user_type):
    # Hash the password
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Get the next user ID
    user_count = mongo_db.users.count_documents({})
    user_id = user_count + 1
    
    try:
        # Insert user data into MongoDB
        mongo_db.user.insert_one({
            'user_id': user_id,
            'username': username,
            'email': email,
            'password': hashed_pw.decode('utf-8'),
            'first_name': first_name,
            'last_name': last_name,
            'bio': bio,
            'user_type': user_type,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        })
        print(f"User {username} inserted successfully into MongoDB.")
    except Exception as e:
        print(f"Error inserting user into MongoDB: {e}")



fs = gridfs.GridFS(mongo_db)

def add_artwork(user_id, title, description, image_file):
    artwork_collection = mongo_db['artworks']
    image_id = fs.put(image_file, filename=image_file.name)
    artwork_data = {
        'user_id': ObjectId(user_id),
        'title': title,
        'description': description,
        'image_id': image_id
    }
    artwork_collection.insert_one(artwork_data)

def get_all_artworks():
    artwork_collection = mongo_db['artworks']
    users_collection = mongo_db['user']

    # Aggregation pipeline to join artworks with users
    pipeline = [
        {
            '$lookup': {
                'from': 'user',
                'localField': 'user_id',
                'foreignField': '_id',
                'as': 'user_info'
            }
        },
        {
            '$unwind': '$user_info'
        },
        {
            '$project': {
                'image_id': 1,
                'title': 1,
                'description': 1,
                'username': '$user_info.username',
                # 'created_at': 1
            }
        }
    ]

    artworks = list(artwork_collection.aggregate(pipeline))


    return artworks