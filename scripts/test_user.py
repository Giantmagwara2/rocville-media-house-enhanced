import pytest
from user import User

def test_user_to_dict():
    user = User(id=1, username='test', email='test@example.com')
    d = user.to_dict()
    assert d['username'] == 'test'
    assert d['email'] == 'test@example.com'
