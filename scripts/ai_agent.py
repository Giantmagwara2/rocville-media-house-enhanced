from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime
from src.models.user import db
from src.models.ai_agent import Conversation, UserProfile, Lead, Task, Analytics
from src.services.whatsapp_service import WhatsAppService
from src.services.ai_processor import AIProcessor
from src.services.translation_service import TranslationService
from src.services.location_service import LocationService

# Initialize blueprint
ai_agent_bp = Blueprint('ai_agent', __name__)

# Initialize services
whatsapp_service = WhatsAppService(
    access_token=os.getenv('WHATSAPP_ACCESS_TOKEN'),
    verify_token=os.getenv('WHATSAPP_VERIFY_TOKEN'),
    phone_number_id=os.getenv('WHATSAPP_PHONE_NUMBER_ID')
)

ai_processor = AIProcessor(api_key=os.getenv('OPENAI_API_KEY'))
translation_service = TranslationService(google_api_key=os.getenv('GOOGLE_TRANSLATE_API_KEY'))
location_service = LocationService(
    google_api_key=os.getenv('GOOGLE_MAPS_API_KEY'),
    ipstack_api_key=os.getenv('IPSTACK_API_KEY')
)

