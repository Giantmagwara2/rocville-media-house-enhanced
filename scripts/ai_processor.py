import openai
import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import requests
from src.models.ai_agent import UserProfile, Conversation, Lead, KnowledgeBase, db

