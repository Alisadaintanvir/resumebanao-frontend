from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core import mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import PasswordResetTokenGenerator

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_user(self):
        email = "normal@example.com"
        password = "Password123!"
        user = User.objects.create_user(email=email, password=password)
        
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(str(user), email)

    def test_create_user_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="Password123!")

    def test_create_superuser(self):
        email = "admin@example.com"
        password = "Password123!"
        admin_user = User.objects.create_superuser(email=email, password=password)
        
        self.assertEqual(admin_user.email, email)
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.email = "testuser@example.com"
        self.password = "StrongPassword123!"
        self.user = User.objects.create_user(
            email=self.email, 
            password=self.password, 
            first_name="Test", 
            last_name="User"
        )
        
        # Helper login
        response = self.client.post(reverse('auth_login'), {
            'email': self.email,
            'password': self.password
        })
        self.access_token = response.data['access']
        
    def test_registration_success(self):
        url = reverse('auth_register')
        data = {
            'email': 'newuser@example.com',
            'password': 'AnotherPassword123!',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(User.objects.count(), 2)

    def test_registration_weak_password(self):
        url = reverse('auth_register')
        data = {
            'email': 'weak@example.com',
            'password': '123'  # Too short, should fail validation
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_success(self):
        url = reverse('auth_login')
        data = {
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_login_failure(self):
        url = reverse('auth_login')
        data = {
            'email': self.email,
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_profile_fetch_success(self):
        url = reverse('auth_profile')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.email)
        self.assertEqual(response.data['first_name'], "Test")
        
    def test_profile_fetch_unauthorized(self):
        url = reverse('auth_profile')
        self.client.credentials() # Clear credentials
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_change_password(self):
        url = reverse('auth_change_password')
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        data = {
            'old_password': self.password,
            'new_password': 'NewStrongPassword123!'
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify old password no longer works
        self.user.refresh_from_db()
        self.assertFalse(self.user.check_password(self.password))
        self.assertTrue(self.user.check_password('NewStrongPassword123!'))

    def test_password_reset_request(self):
        url = reverse('auth_password_reset')
        data = {
            'email': self.email
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify email was "sent"
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Password Reset Request', mail.outbox[0].subject)
        
    def test_password_reset_confirm(self):
        url = reverse('auth_password_reset_confirm')
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = PasswordResetTokenGenerator().make_token(self.user)
        
        data = {
            'uidb64': uidb64,
            'token': token,
            'new_password': 'ResetPassword123!'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('ResetPassword123!'))

    def test_password_reset_confirm_invalid_token(self):
        url = reverse('auth_password_reset_confirm')
        uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        
        data = {
            'uidb64': uidb64,
            'token': 'invalid-token',
            'new_password': 'ResetPassword123!'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('token', response.data)
