from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import CustomUser
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings

from .models import PasswordResetToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    logger.info("Login API CALLED")  # ✅ Thêm dòng này
    username = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = CustomUser.objects.get(email=email)
        token = get_random_string(32)
        PasswordResetToken.objects.update_or_create(user=user, defaults={'token': token})
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        send_mail(
            subject="Reset your password",
            message=f"Click the link to reset your password: {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return Response({"message": "Password reset link sent."})
    except CustomUser.DoesNotExist:
        return Response({"error": "Email not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('password')
    try:
        reset_obj = PasswordResetToken.objects.get(token=token)
        user = reset_obj.user
        user.set_password(new_password)
        user.save()
        reset_obj.delete()  # Xóa token sau khi dùng
        return Response({"message": "Password has been reset."})
    except PasswordResetToken.DoesNotExist:
        return Response({"error": "Invalid or expired token"}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    

    if CustomUser.objects.filter(email=email).exists():
        return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(email=email, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "User registered successfully.",
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('token')

    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)

        email = idinfo['email']
        name = idinfo.get('name', '')

        user, created = CustomUser.objects.get_or_create(email=email, defaults={'name': name})
        if created:
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })

    except ValueError:
        return Response({'error': 'Invalid token'}, status=400)
