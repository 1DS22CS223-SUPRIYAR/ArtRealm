from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .db_operations import insert_user, add_artwork
from artrealm.settings import mongo_db
import bcrypt
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse, HttpResponseServerError, HttpResponseNotFound
from bson import ObjectId
import gridfs
import base64


@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        # Check if user already exists (optional)
        # existing_user = mongo_db.users.find_one({"email": data['email']})
        # if existing_user:
        #     return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
        # Insert the new user
        insert_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            bio=data['bio'],
            user_type=data['user_type']
        )
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    users_collection = mongo_db['user']  

    user = users_collection.find_one({'username': username})
    if user:
        stored_password = user.get('password')
        if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
        
            user_id = str(user.get('_id'))  
            return Response({'message': 'Login successful', 'user_id': user_id}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

 
@api_view(['POST'])
def profile_view(request):
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = mongo_db['user'].find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        
        # Return user data
        return Response(user, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def add_artwork_view(request):
    user_id = request.data.get('user_id')
    title = request.data.get('title')
    description = request.data.get('description')
    image_file = request.FILES.get('image')

    if not user_id or not title or not description or not image_file:
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        add_artwork(user_id, title, description, image_file)
        return Response({'message': 'Artwork added successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

fs = gridfs.GridFS(mongo_db)

@api_view(['GET'])
def get_all_artworks_view(request):
    try:
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
                    '_id': {'$toString': '$_id'},
                    'title': 1,
                    'description': 1,
                    'username': '$user_info.username',
                    'image_id': {'$toString': '$image_id'}  # Convert ObjectId to string
                }
            }
        ]

        artworks = list(artwork_collection.aggregate(pipeline))

        for artwork in artworks:
            try:
                file = fs.get(ObjectId(artwork['image_id']))
                artwork['image_data'] = base64.b64encode(file.read()).decode('utf-8')  # Base64 encode the image data
                artwork['image_content_type'] = file.content_type if file.content_type else 'image/jpeg'  # Set content type or default to jpeg
            except gridfs.errors.NoFile:
                artwork['image_data'] = None
                artwork['image_content_type'] = 'image/jpeg'  # Default content type when no file found

            # Remove 'image_id' if it's not needed in the response
            del artwork['image_id']

        return Response(artworks, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)