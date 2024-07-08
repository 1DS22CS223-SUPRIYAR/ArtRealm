from django.urls import path
from .views import register_view , login_view, profile_view, add_artwork_view, get_all_artworks_view
urlpatterns = [
    path('register/', register_view, name='register'), 
    path('login/', login_view, name='login'), 
    path('profile/', profile_view, name='profile'), 
    path('add_artwork/', add_artwork_view, name='add_artwork'),
    path('artworks/', get_all_artworks_view, name='artworks'),
    # path('api/artwork_image/<image_id>/', get_artwork_image_view, name='artwork_image'),
]

