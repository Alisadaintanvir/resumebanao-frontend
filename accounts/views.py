from rest_framework import generics, status, views, serializers
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    @extend_schema(
        tags=['Authentication'],
        summary="Register a new user",
        responses={
            201: inline_serializer(
                name='RegisterResponse',
                fields={
                    'user': UserSerializer(),
                    'refresh': serializers.CharField(),
                    'access': serializers.CharField(),
                }
            )
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Optionally, you can return JWT tokens upon registration
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


@extend_schema(tags=['Users'], summary="Retrieve or update the user's profile")
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

    @extend_schema(
        tags=['Authentication'],
        summary="Change user password",
        responses={
            200: inline_serializer(name='ChangePasswordSuccess', fields={'detail': serializers.CharField()}),
            400: inline_serializer(name='ChangePasswordError', fields={'old_password': serializers.ListField(child=serializers.CharField())})
        }
    )
    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"detail": "Password successfully updated."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(views.APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetRequestSerializer

    @extend_schema(
        tags=['Authentication'],
        summary="Request a Password Reset",
        description="Sends an email with a password reset link if the user exists.",
        responses={
            200: inline_serializer(name='PasswordResetRequestSuccess', fields={'detail': serializers.CharField()}),
            400: OpenApiResponse(description="Validation error")
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                token = PasswordResetTokenGenerator().make_token(user)
                
                # In production, change the frontend_url to point to your actual frontend
                frontend_url = "http://localhost:3000/reset-password"
                reset_url = f"{frontend_url}/{uidb64}/{token}/"
                
                send_mail(
                    subject="Password Reset Request",
                    message=f"Use the following link to reset your password: {reset_url}",
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@airesumebuilder.local',
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            
            # Return a success message even if the user is not found, to prevent email enumeration attacks
            return Response({"detail": "Password reset email has been sent if the email exists in our system."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(views.APIView):
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer

    @extend_schema(
        tags=['Authentication'],
        summary="Confirm Password Reset",
        description="Sets a new password using the token sent to the user's email.",
        responses={
            200: inline_serializer(name='PasswordResetConfirmSuccess', fields={'detail': serializers.CharField()}),
            400: OpenApiResponse(description="Invalid user ID, token, or password format.")
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
