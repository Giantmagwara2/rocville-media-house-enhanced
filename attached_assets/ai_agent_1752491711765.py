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

@ai_agent_bp.route('/webhook', methods=['GET', 'POST'])
def whatsapp_webhook():
    """WhatsApp webhook endpoint for message handling"""
    
    if request.method == 'GET':
        # Webhook verification
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        verification_result = whatsapp_service.verify_webhook(mode, token, challenge)
        
        if verification_result:
            return verification_result
        else:
            return 'Forbidden', 403
    
    elif request.method == 'POST':
        # Process incoming webhook data
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({'status': 'error', 'message': 'No data received'}), 400
            
            # Process webhook with WhatsApp service
            result = whatsapp_service.process_webhook(data)
            
            # Log analytics
            _log_webhook_analytics(result)
            
            return jsonify(result), 200
            
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500

@ai_agent_bp.route('/send-message', methods=['POST'])
def send_message():
    """Send message via WhatsApp API"""
    try:
        data = request.get_json()
        
        if not data or not data.get('to') or not data.get('message'):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: to, message'
            }), 400
        
        to_number = data['to']
        message = data['message']
        message_type = data.get('type', 'text')
        
        # Send message
        result = whatsapp_service.send_message(to_number, message, message_type)
        
        # Store outgoing message if successful
        if result.get('success'):
            conversation = Conversation(
                user_phone=to_number,
                message_type='outgoing',
                message_content=message,
                message_id=result.get('message_id'),
                timestamp=datetime.utcnow()
            )
            db.session.add(conversation)
            db.session.commit()
        
        return jsonify(result), 200 if result.get('success') else 400
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/send-interactive', methods=['POST'])
def send_interactive_message():
    """Send interactive message with buttons"""
    try:
        data = request.get_json()
        
        required_fields = ['to', 'header', 'body', 'buttons']
        if not all(field in data for field in required_fields):
            return jsonify({
                'status': 'error',
                'message': f'Missing required fields: {", ".join(required_fields)}'
            }), 400
        
        result = whatsapp_service.send_interactive_message(
            data['to'],
            data['header'],
            data['body'],
            data['buttons']
        )
        
        return jsonify(result), 200 if result.get('success') else 400
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/conversations', methods=['GET'])
def get_conversations():
    """Get conversation history"""
    try:
        phone_number = request.args.get('phone')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        query = Conversation.query
        
        if phone_number:
            query = query.filter_by(user_phone=phone_number)
        
        conversations = query.order_by(Conversation.timestamp.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'conversations': [conv.to_dict() for conv in conversations],
            'total': query.count()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/users', methods=['GET'])
def get_users():
    """Get user profiles"""
    try:
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        users = UserProfile.query.order_by(UserProfile.last_interaction.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'users': [user.to_dict() for user in users],
            'total': UserProfile.query.count()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/users/<phone_number>', methods=['GET'])
def get_user_profile(phone_number):
    """Get specific user profile"""
    try:
        user = UserProfile.query.filter_by(phone_number=phone_number).first()
        
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Get recent conversations
        conversations = Conversation.query.filter_by(user_phone=phone_number).order_by(Conversation.timestamp.desc()).limit(10).all()
        
        return jsonify({
            'status': 'success',
            'user': user.to_dict(),
            'recent_conversations': [conv.to_dict() for conv in conversations]
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/leads', methods=['GET'])
def get_leads():
    """Get leads"""
    try:
        status = request.args.get('status')
        limit = int(request.args.get('limit', 50))
        offset = int(request.args.get('offset', 0))
        
        query = Lead.query
        
        if status:
            query = query.filter_by(status=status)
        
        leads = query.order_by(Lead.created_at.desc()).offset(offset).limit(limit).all()
        
        return jsonify({
            'status': 'success',
            'leads': [lead.to_dict() for lead in leads],
            'total': query.count()
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/pricing', methods=['POST'])
def get_pricing():
    """Get location-based pricing for services"""
    try:
        data = request.get_json()
        
        service_type = data.get('service_type')
        country_code = data.get('country_code', 'US')
        custom_requirements = data.get('custom_requirements', [])
        
        if not service_type:
            return jsonify({
                'status': 'error',
                'message': 'service_type is required'
            }), 400
        
        # Get pricing from AI processor
        pricing = ai_processor.get_service_pricing(service_type, country_code, custom_requirements)
        
        # Get additional location info
        location_info = location_service.get_regional_info(country_code)
        market_info = location_service.get_market_info(country_code)
        
        return jsonify({
            'status': 'success',
            'pricing': pricing,
            'location_info': location_info,
            'market_info': market_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/translate', methods=['POST'])
def translate_text():
    """Translate text to target language"""
    try:
        data = request.get_json()
        
        text = data.get('text')
        target_lang = data.get('target_lang', 'en')
        source_lang = data.get('source_lang', 'auto')
        
        if not text:
            return jsonify({
                'status': 'error',
                'message': 'text is required'
            }), 400
        
        # Detect language if auto
        if source_lang == 'auto':
            source_lang = translation_service.detect_language(text)
        
        # Translate text
        translated_text = translation_service.translate_text(text, source_lang, target_lang)
        
        return jsonify({
            'status': 'success',
            'original_text': text,
            'translated_text': translated_text,
            'source_language': source_lang,
            'target_language': target_lang
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/location', methods=['POST'])
def get_location():
    """Get location information from IP or coordinates"""
    try:
        data = request.get_json()
        
        if 'ip' in data:
            # Get location from IP
            location_info = location_service.get_location_from_ip(data['ip'])
        elif 'latitude' in data and 'longitude' in data:
            # Get location from coordinates
            location_info = location_service.get_location_info(data['latitude'], data['longitude'])
        else:
            return jsonify({
                'status': 'error',
                'message': 'Either ip or latitude/longitude is required'
            }), 400
        
        return jsonify({
            'status': 'success',
            'location': location_info
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data"""
    try:
        metric_type = request.args.get('type')
        days = int(request.args.get('days', 30))
        
        from datetime import timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        
        query = Analytics.query.filter(Analytics.timestamp >= start_date)
        
        if metric_type:
            query = query.filter_by(metric_type=metric_type)
        
        analytics = query.order_by(Analytics.timestamp.desc()).all()
        
        # Aggregate data
        aggregated_data = {}
        for record in analytics:
            key = f"{record.metric_type}_{record.metric_name}"
            if key not in aggregated_data:
                aggregated_data[key] = {
                    'metric_type': record.metric_type,
                    'metric_name': record.metric_name,
                    'values': [],
                    'total': 0,
                    'count': 0
                }
            
            aggregated_data[key]['values'].append({
                'value': record.metric_value,
                'timestamp': record.timestamp.isoformat(),
                'dimensions': json.loads(record.dimensions) if record.dimensions else {}
            })
            aggregated_data[key]['total'] += record.metric_value
            aggregated_data[key]['count'] += 1
        
        # Calculate averages
        for key in aggregated_data:
            if aggregated_data[key]['count'] > 0:
                aggregated_data[key]['average'] = aggregated_data[key]['total'] / aggregated_data[key]['count']
        
        return jsonify({
            'status': 'success',
            'analytics': list(aggregated_data.values()),
            'period_days': days
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@ai_agent_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        from sqlalchemy import text
        db.session.execute(text('SELECT 1'))
        
        # Get basic stats
        total_users = UserProfile.query.count()
        total_conversations = Conversation.query.count()
        total_leads = Lead.query.count()
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'stats': {
                'total_users': total_users,
                'total_conversations': total_conversations,
                'total_leads': total_leads
            },
            'services': {
                'database': 'connected',
                'whatsapp': 'configured' if whatsapp_service.access_token else 'not_configured',
                'ai_processor': 'configured' if ai_processor.api_key else 'not_configured'
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

# Helper functions
def _log_webhook_analytics(result):
    """Log webhook processing analytics"""
    try:
        # Log webhook processing metrics
        analytics_record = Analytics(
            metric_type='webhook',
            metric_name='messages_processed',
            metric_value=len(result.get('responses', [])),
            dimensions=json.dumps({
                'status': result.get('status'),
                'processed': result.get('processed', False)
            })
        )
        db.session.add(analytics_record)
        
        # Log individual response metrics
        for response in result.get('responses', []):
            if response.get('message_processed'):
                response_analytics = Analytics(
                    metric_type='message',
                    metric_name='processing_success',
                    metric_value=1,
                    dimensions=json.dumps({
                        'from': response.get('from'),
                        'response_sent': response.get('response_sent', False)
                    })
                )
                db.session.add(response_analytics)
        
        db.session.commit()
        
    except Exception as e:
        print(f"Analytics logging error: {e}")

@ai_agent_bp.route('/test-ai', methods=['POST'])
def test_ai():
    """Test AI processing endpoint"""
    try:
        data = request.get_json()
        
        message = data.get('message', 'Hello')
        phone_number = data.get('phone', '+1234567890')
        
        # Process message with AI
        result = ai_processor.process_message(message, phone_number)
        
        return jsonify({
            'status': 'success',
            'result': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

