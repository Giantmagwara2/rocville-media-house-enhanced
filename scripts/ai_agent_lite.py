from flask import Blueprint, request, jsonify
from models.user import db
from models.ai_agent import Conversation, UserProfile, Lead, Task, KnowledgeBase
from services.translation_service_lite import translation_service
from services.location_service_lite import location_service
import time
import json
from datetime import datetime

