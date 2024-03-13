from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

class CustomUserManagerTestCase(TestCase):
    def test_create_superuser_with_is_superuser_false(self):
        User = get_user_model()
        with self.assertRaises(ValueError) as context:
            User.objects.create_superuser(
                email='admin@example.com',
                password='password',
                is_superuser=False
            )
        
        expected_error_message = str(_("Superuser must have is_superuser=True."))
        self.assertTrue(
            expected_error_message in str(context.exception),
            "Expected ValueError with specific message"
        )
