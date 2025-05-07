from django.urls import path
from .views import register_user, login_user, forgot_password, reset_password
from . import views

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('forgot-password/', forgot_password, name='forgot-password'),
    path('reset-password/<uidb64>/<token>/', reset_password, name='reset-password'),
    path('google-login/', views.google_login), 
]
