import pytest
from ai_agent import ai_agent_bp

def test_blueprint_name():
    assert ai_agent_bp.name == 'ai_agent'
