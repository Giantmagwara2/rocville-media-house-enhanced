from flask import Blueprint, request, jsonify
from models.user import db
from models.ai_agent import Conversation, UserProfile, Lead, Task, KnowledgeBase
from services.translation_service_lite import translation_service
from services.location_service_lite import location_service
import time
import json
from datetime import datetime

# Simple logging for production
class SimpleLogger:
    def log_error(self, error, context):
        print(f"ERROR [{context}]: {error}")
    
    def log_event(self, event):
        print(f"EVENT: {event}")

logger = SimpleLogger()

def monitor_endpoint(func):
    """Simple monitoring decorator"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            duration = (time.time() - start_time) * 1000
            print(f"API Call: {func.__name__} completed in {duration:.2f}ms")
            return result
        except Exception as e:
            logger.log_error(e, func.__name__)
            raise
    wrapper.__name__ = func.__name__
    return wrapper

def log_user_action(action):
    """Simple user action logging decorator"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"User Action: {action}")
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator

def cached(timeout=300, prefix='cache'):
    """Simple caching decorator (no-op for production)"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        wrapper.__name__ = func.__name__
        return wrapper
    return decorator

ai_agent_bp = Blueprint('ai_agent', __name__)

@ai_agent_bp.route('/health', methods=['GET'])
@monitor_endpoint
def health_check():
    """AI Super Agent health check endpoint"""
    try:
        # Test database connection
        db.session.execute(db.text('SELECT 1'))
        
        return jsonify({
            "status": "healthy",
            "service": "AI Super Agent",
            "version": "1.0.0",
            "timestamp": time.time(),
            "components": {
                "database": "connected",
                "translation": "active",
                "location": "active",
                "ai_processing": "ready"
            },
            "features": {
                "multilingual_support": True,
                "location_based_pricing": True,
                "whatsapp_integration": True,
                "conversation_tracking": True,
                "lead_management": True
            }
        })
    except Exception as e:
        logger.log_error(e, "Health check")
        return jsonify({
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }), 503

@ai_agent_bp.route('/webhook', methods=['GET', 'POST'])
@monitor_endpoint
def whatsapp_webhook():
    """WhatsApp webhook endpoint for receiving messages"""
    try:
        if request.method == 'GET':
            # Webhook verification
            verify_token = request.args.get('hub.verify_token')
            challenge = request.args.get('hub.challenge')
            
            if verify_token == 'rocville_ai_agent_2025':
                return challenge
            else:
                return 'Invalid verify token', 403
        
        elif request.method == 'POST':
            # Process incoming WhatsApp message
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "No data received"}), 400
            
            # Log webhook received
            print(f"WhatsApp webhook received with data keys: {list(data.keys())}")
            
            # Process the webhook data
            processed = process_whatsapp_message(data)
            
            return jsonify({"status": "success", "processed": processed})
            
    except Exception as e:
        logger.log_error(e, "WhatsApp webhook")
        return jsonify({"error": str(e)}), 500

def process_whatsapp_message(data):
    """Process incoming WhatsApp message"""
    try:
        # Extract message data (simplified)
        if 'entry' in data:
            for entry in data['entry']:
                if 'changes' in entry:
                    for change in entry['changes']:
                        if 'value' in change and 'messages' in change['value']:
                            for message in change['value']['messages']:
                                phone = message.get('from', '')
                                text = message.get('text', {}).get('body', '')
                                
                                if phone and text:
                                    # Process the message
                                    response = process_user_message(phone, text)
                                    return {"phone": phone, "response": response}
        
        return {"status": "no_messages_found"}
        
    except Exception as e:
        logger.log_error(e, "Process WhatsApp message")
        return {"error": str(e)}

@ai_agent_bp.route('/test-ai', methods=['POST'])
@monitor_endpoint
@log_user_action("ai_chat_interaction")
def test_ai_processing():
    """Test AI processing endpoint for frontend integration"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        message = data.get('message', '')
        phone = data.get('phone', 'test_user')
        location = data.get('location', {})
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Process the message
        start_time = time.time()
        response = process_user_message(phone, message, location)
        processing_time = (time.time() - start_time) * 1000
        
        # Log AI processing
        print(f"AI processing for {phone}: {processing_time:.2f}ms")
        
        return jsonify({
            "status": "success",
            "response": response,
            "processing_time_ms": round(processing_time, 2)
        })
        
    except Exception as e:
        logger.log_error(e, "Test AI processing")
        return jsonify({"error": str(e)}), 500

def process_user_message(phone: str, message: str, location: dict = None):
    """Process user message and generate AI response"""
    try:
        # Detect language
        detected_lang = translation_service.detect_language(message)
        
        # Get or create user profile
        user_profile = get_or_create_user_profile(phone, detected_lang, location)
        
        # Generate AI response based on message content
        response_text = generate_ai_response(message, user_profile, detected_lang)
        
        # Save conversation
        save_conversation(phone, message, response_text, detected_lang)
        
        # Update user interaction count
        update_user_interaction(phone)
        
        return {
            "message": response_text,
            "language": detected_lang,
            "user_id": phone,
            "timestamp": time.time()
        }
        
    except Exception as e:
        logger.log_error(e, "Process user message")
        return {
            "message": "I apologize, but I'm experiencing technical difficulties. Please try again later.",
            "language": "en",
            "error": True
        }

def generate_ai_response(message: str, user_profile: dict, language: str) -> str:
    """Generate AI response based on message content and user profile"""
    message_lower = message.lower()
    
    # Greeting responses
    if any(word in message_lower for word in ['hello', 'hi', 'hey', 'hola', 'bonjour', 'jambo']):
        greeting = translation_service.get_localized_greeting(language)
        return greeting
    
    # Service inquiries
    elif any(word in message_lower for word in ['website', 'web', 'development', 'develop']):
        response = "I'd be happy to help you with web development! RocVille Media House specializes in creating modern, responsive websites. We offer custom web development, e-commerce solutions, and web applications. Would you like to know more about our web development packages and pricing?"
        if language != 'en':
            response = f"[{translation_service.language_names.get(language, language)}] {response}"
        return response
    
    elif any(word in message_lower for word in ['marketing', 'digital', 'social', 'seo']):
        response = "Great! Digital marketing is one of our core services. We provide SEO optimization, social media management, content marketing, and paid advertising campaigns. Our strategies are tailored to help businesses grow their online presence and reach their target audience effectively."
        if language != 'en':
            response = f"[{translation_service.language_names.get(language, language)}] {response}"
        return response
    
    elif any(word in message_lower for word in ['brand', 'logo', 'design', 'branding']):
        response = "Excellent! Branding and design are essential for business success. We create compelling brand identities, professional logos, marketing materials, and complete brand guidelines. Our design team ensures your brand stands out and resonates with your target audience."
        if language != 'en':
            response = f"[{translation_service.language_names.get(language, language)}] {response}"
        return response
    
    elif any(word in message_lower for word in ['price', 'cost', 'pricing', 'quote', 'budget']):
        country_code = user_profile.get('country', 'US')
        multiplier = location_service.calculate_pricing_multiplier(country_code)
        currency = location_service.get_currency_for_country(country_code)
        
        base_prices = {
            'website': 1500,
            'marketing': 800,
            'branding': 1200
        }
        
        pricing_text = f"Here are our service packages for {country_code}:\n\n"
        pricing_text += f"🌐 Web Development: {translation_service.format_currency(base_prices['website'] * multiplier, currency)}\n"
        pricing_text += f"📱 Digital Marketing: {translation_service.format_currency(base_prices['marketing'] * multiplier, currency)}\n"
        pricing_text += f"🎨 Branding Package: {translation_service.format_currency(base_prices['branding'] * multiplier, currency)}\n\n"
        pricing_text += "These are starting prices. We offer customized solutions based on your specific needs. Would you like to discuss your project requirements?"
        
        if language != 'en':
            pricing_text = f"[{translation_service.language_names.get(language, language)}] {pricing_text}"
        return pricing_text
    
    elif any(word in message_lower for word in ['contact', 'phone', 'call', 'email', 'reach']):
        response = "You can reach RocVille Media House through:\n\n📞 Phone/WhatsApp: 0753426492\n📧 Email: rocvillemediahouse@gmail.com\n\nWe're available Monday to Friday, 9 AM to 6 PM. Feel free to call or message us anytime for immediate assistance!"
        if language != 'en':
            response = f"[{translation_service.language_names.get(language, language)}] {response}"
        return response
    
    # Default response
    else:
        response = "Thank you for your message! RocVille Media House offers comprehensive digital solutions including web development, digital marketing, branding, and UI/UX design. How can I assist you with your business needs today?"
        if language != 'en':
            response = f"[{translation_service.language_names.get(language, language)}] {response}"
        return response

@cached(timeout=3600, prefix='user_profile')
def get_or_create_user_profile(phone: str, language: str, location: dict = None):
    """Get or create user profile"""
    try:
        # Try to get existing user profile
        user = UserProfile.query.filter_by(phone_number=phone).first()
        
        if not user:
            # Get location info
            if location:
                country = location.get('country_code', 'US')
                city = location.get('city', 'Unknown')
            else:
                location_data = location_service.get_location_by_ip()
                country = location_data.get('country_code', 'US')
                city = location_data.get('city', 'Unknown')
            
            currency = location_service.get_currency_for_country(country)
            
            # Create new user profile
            user = UserProfile(
                phone_number=phone,
                preferred_language=language,
                country=country,
                city=city,
                currency=currency,
                interests=[],
                interaction_count=0,
                lead_score=0
            )
            
            db.session.add(user)
            db.session.commit()
        
        return {
            'phone': user.phone_number,
            'language': user.preferred_language,
            'country': user.country,
            'city': user.city,
            'currency': user.currency,
            'interaction_count': user.interaction_count
        }
        
    except Exception as e:
        logger.log_error(e, "Get or create user profile")
        # Return default profile
        return {
            'phone': phone,
            'language': language,
            'country': 'US',
            'city': 'Unknown',
            'currency': 'USD',
            'interaction_count': 0
        }

def save_conversation(phone: str, message: str, response: str, language: str):
    """Save conversation to database"""
    try:
        conversation = Conversation(
            phone_number=phone,
            message=message,
            response=response,
            language=language,
            processed=True
        )
        
        db.session.add(conversation)
        db.session.commit()
        
    except Exception as e:
        logger.log_error(e, "Save conversation")

def update_user_interaction(phone: str):
    """Update user interaction count"""
    try:
        user = UserProfile.query.filter_by(phone_number=phone).first()
        if user:
            user.interaction_count += 1
            user.last_interaction = datetime.utcnow()
            db.session.commit()
            
    except Exception as e:
        logger.log_error(e, "Update user interaction")

@ai_agent_bp.route('/conversations', methods=['GET'])
@monitor_endpoint
def get_conversations():
    """Get conversation history"""
    try:
        phone = request.args.get('phone')
        limit = int(request.args.get('limit', 50))
        
        if phone:
            conversations = Conversation.query.filter_by(phone_number=phone).order_by(Conversation.timestamp.desc()).limit(limit).all()
        else:
            conversations = Conversation.query.order_by(Conversation.timestamp.desc()).limit(limit).all()
        
        return jsonify({
            "conversations": [
                {
                    "id": conv.id,
                    "phone": conv.phone_number,
                    "message": conv.message,
                    "response": conv.response,
                    "language": conv.language,
                    "timestamp": conv.timestamp.isoformat()
                }
                for conv in conversations
            ]
        })
        
    except Exception as e:
        logger.log_error(e, "Get conversations")
        return jsonify({"error": str(e)}), 500

@ai_agent_bp.route('/users', methods=['GET'])
@monitor_endpoint
def get_users():
    """Get user profiles"""
    try:
        limit = int(request.args.get('limit', 50))
        users = UserProfile.query.order_by(UserProfile.interaction_count.desc()).limit(limit).all()
        
        return jsonify({
            "users": [
                {
                    "id": user.id,
                    "phone": user.phone_number,
                    "language": user.preferred_language,
                    "country": user.country,
                    "city": user.city,
                    "currency": user.currency,
                    "interaction_count": user.interaction_count,
                    "lead_score": user.lead_score
                }
                for user in users
            ]
        })
        
    except Exception as e:
        logger.log_error(e, "Get users")
        return jsonify({"error": str(e)}), 500

@ai_agent_bp.route('/translate', methods=['POST'])
@monitor_endpoint
def translate_text():
    """Translate text endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        text = data.get('text', '')
        target_lang = data.get('target_lang', 'en')
        source_lang = data.get('source_lang', 'auto')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        translated_text = translation_service.translate_text(text, target_lang, source_lang)
        
        return jsonify({
            "original_text": text,
            "translated_text": translated_text,
            "source_language": source_lang,
            "target_language": target_lang,
            "timestamp": time.time()
        })
        
    except Exception as e:
        logger.log_error(e, "Translate text")
        return jsonify({"error": str(e)}), 500

@ai_agent_bp.route('/location', methods=['POST'])
@monitor_endpoint
def get_location():
    """Get location information"""
    try:
        data = request.get_json()
        ip = data.get('ip', 'auto') if data else 'auto'
        
        location_data = location_service.get_location_by_ip(ip)
        
        return jsonify({
            "location": location_data,
            "timestamp": time.time()
        })
        
    except Exception as e:
        logger.log_error(e, "Get location")
        return jsonify({"error": str(e)}), 500

@ai_agent_bp.route('/pricing', methods=['GET'])
@monitor_endpoint
def get_pricing():
    """Get location-based pricing"""
    try:
        country_code = request.args.get('country', 'US')
        service = request.args.get('service', 'all')
        
        multiplier = location_service.calculate_pricing_multiplier(country_code)
        currency = location_service.get_currency_for_country(country_code)
        
        base_prices = {
            'web_development': 1500,
            'digital_marketing': 800,
            'branding': 1200,
            'ui_ux_design': 1000,
            'app_development': 2500,
            'content_creation': 600
        }
        
        if service != 'all' and service in base_prices:
            price = base_prices[service] * multiplier
            return jsonify({
                "service": service,
                "base_price": base_prices[service],
                "local_price": price,
                "currency": currency,
                "country": country_code,
                "multiplier": multiplier,
                "formatted_price": translation_service.format_currency(price, currency)
            })
        else:
            pricing = {}
            for svc, base_price in base_prices.items():
                local_price = base_price * multiplier
                pricing[svc] = {
                    "base_price": base_price,
                    "local_price": local_price,
                    "formatted_price": translation_service.format_currency(local_price, currency)
                }
            
            return jsonify({
                "pricing": pricing,
                "currency": currency,
                "country": country_code,
                "multiplier": multiplier,
                "timestamp": time.time()
            })
        
    except Exception as e:
        logger.log_error(e, "Get pricing")
        return jsonify({"error": str(e)}), 500

@ai_agent_bp.route('/analytics', methods=['GET'])
@monitor_endpoint
def get_analytics():
    """Get analytics and metrics"""
    try:
        # Get basic analytics
        total_conversations = Conversation.query.count()
        total_users = UserProfile.query.count()
        
        # Get language distribution
        language_stats = db.session.query(
            Conversation.language,
            db.func.count(Conversation.id).label('count')
        ).group_by(Conversation.language).all()
        
        # Get country distribution
        country_stats = db.session.query(
            UserProfile.country,
            db.func.count(UserProfile.id).label('count')
        ).group_by(UserProfile.country).all()
        
        return jsonify({
            "total_conversations": total_conversations,
            "total_users": total_users,
            "language_distribution": {lang: count for lang, count in language_stats},
            "country_distribution": {country: count for country, count in country_stats},
            "timestamp": time.time()
        })
        
    except Exception as e:
        logger.log_error(e, "Get analytics")
        return jsonify({"error": str(e)}), 500

