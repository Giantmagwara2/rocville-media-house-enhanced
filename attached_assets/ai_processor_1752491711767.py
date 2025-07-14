import openai
import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import requests
from src.models.ai_agent import UserProfile, Conversation, Lead, KnowledgeBase, db

class AIProcessor:
    """Core AI processing engine for natural language understanding and generation"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or "your-openai-api-key"  # Replace with actual API key
        openai.api_key = self.api_key
        
        # Service categories and pricing (base USD prices)
        self.services = {
            "web_development": {
                "name": "Web Development",
                "base_price": 2500,
                "description": "Custom websites and web applications",
                "features": ["Responsive Design", "E-commerce", "CMS", "PWA", "API Integration"]
            },
            "digital_marketing": {
                "name": "Digital Marketing", 
                "base_price": 1500,
                "description": "Strategic marketing campaigns",
                "features": ["SEO", "PPC", "Social Media", "Email Marketing", "Analytics"]
            },
            "branding": {
                "name": "Branding & Identity",
                "base_price": 1200,
                "description": "Brand identity and visual design",
                "features": ["Logo Design", "Brand Strategy", "Visual Identity", "Guidelines"]
            },
            "ui_ux_design": {
                "name": "UI/UX Design",
                "base_price": 1800,
                "description": "User experience and interface design",
                "features": ["User Research", "Wireframing", "Prototyping", "Usability Testing"]
            },
            "app_development": {
                "name": "App Development",
                "base_price": 3500,
                "description": "Mobile applications for iOS and Android",
                "features": ["Native Development", "Cross-Platform", "App Store Optimization"]
            },
            "content_creation": {
                "name": "Content Creation",
                "base_price": 800,
                "description": "Content strategy and creation",
                "features": ["Copywriting", "Blog Content", "Video Production", "Photography"]
            }
        }
        
        # Location-based pricing multipliers
        self.location_multipliers = {
            "US": 1.0, "CA": 0.9, "GB": 0.95, "AU": 0.9, "DE": 0.85, "FR": 0.85,
            "NL": 0.8, "SE": 0.8, "NO": 0.85, "DK": 0.8, "CH": 1.1, "JP": 0.9,
            "SG": 0.75, "HK": 0.8, "IN": 0.3, "PH": 0.25, "TH": 0.35, "MY": 0.4,
            "ID": 0.3, "VN": 0.25, "BD": 0.2, "PK": 0.2, "LK": 0.25, "NP": 0.2,
            "KE": 0.3, "NG": 0.25, "ZA": 0.4, "EG": 0.3, "MA": 0.3, "TN": 0.3,
            "BR": 0.4, "MX": 0.35, "AR": 0.3, "CL": 0.4, "CO": 0.3, "PE": 0.3,
            "RU": 0.4, "UA": 0.25, "PL": 0.5, "CZ": 0.5, "HU": 0.45, "RO": 0.4
        }
    
    def process_message(self, message: str, user_phone: str, user_profile: Optional[UserProfile] = None) -> Dict:
        """Process incoming message and generate appropriate response"""
        try:
            # Analyze message intent and extract entities
            intent_analysis = self._analyze_intent(message)
            entities = self._extract_entities(message)
            
            # Get or create user profile
            if not user_profile:
                user_profile = UserProfile.query.filter_by(phone_number=user_phone).first()
                if not user_profile:
                    user_profile = self._create_user_profile(user_phone)
            
            # Update user interaction count
            user_profile.interaction_count += 1
            user_profile.last_interaction = datetime.utcnow()
            
            # Generate contextual response based on intent
            response = self._generate_response(intent_analysis, entities, user_profile, message)
            
            # Update lead score if applicable
            if intent_analysis.get('is_business_inquiry'):
                self._update_lead_score(user_profile, intent_analysis)
            
            # Create tasks if needed
            tasks = self._create_autonomous_tasks(intent_analysis, entities, user_profile)
            
            db.session.commit()
            
            return {
                "response": response,
                "intent": intent_analysis,
                "entities": entities,
                "tasks_created": len(tasks),
                "user_profile_updated": True
            }
            
        except Exception as e:
            return {
                "response": "I apologize, but I'm experiencing a technical issue. Let me connect you with our team for immediate assistance.",
                "error": str(e),
                "fallback": True
            }
    
    def _analyze_intent(self, message: str) -> Dict:
        """Analyze message intent using AI"""
        try:
            prompt = f"""
            Analyze the following message and determine the user's intent. Return a JSON response with the following structure:
            {{
                "primary_intent": "greeting|inquiry|service_request|pricing|complaint|support|other",
                "service_interest": ["web_development", "digital_marketing", "branding", "ui_ux_design", "app_development", "content_creation"],
                "urgency_level": 1-10,
                "is_business_inquiry": true/false,
                "sentiment": "positive|neutral|negative",
                "requires_human": true/false,
                "confidence": 0.0-1.0
            }}
            
            Message: "{message}"
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=300
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            # Fallback intent analysis
            return {
                "primary_intent": "inquiry",
                "service_interest": [],
                "urgency_level": 5,
                "is_business_inquiry": True,
                "sentiment": "neutral",
                "requires_human": False,
                "confidence": 0.5
            }
    
    def _extract_entities(self, message: str) -> Dict:
        """Extract entities from message"""
        entities = {
            "budget": None,
            "timeline": None,
            "company": None,
            "email": None,
            "name": None,
            "location": None
        }
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, message)
        if emails:
            entities["email"] = emails[0]
        
        # Extract budget mentions
        budget_patterns = [
            r'\$([0-9,]+)',
            r'([0-9,]+)\s*dollars?',
            r'budget.*?([0-9,]+)',
            r'([0-9,]+)\s*USD'
        ]
        for pattern in budget_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                entities["budget"] = match.group(1).replace(',', '')
                break
        
        # Extract timeline mentions
        timeline_patterns = [
            r'(\d+)\s*weeks?',
            r'(\d+)\s*months?',
            r'(\d+)\s*days?',
            r'asap|urgent|immediately',
            r'next\s+week|next\s+month'
        ]
        for pattern in timeline_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                entities["timeline"] = match.group(0)
                break
        
        return entities
    
    def _generate_response(self, intent: Dict, entities: Dict, user_profile: UserProfile, original_message: str) -> str:
        """Generate contextual response based on intent and user profile"""
        try:
            # Build context for AI response generation
            context = {
                "user_name": user_profile.name or "there",
                "user_language": user_profile.preferred_language,
                "user_country": user_profile.country,
                "interaction_count": user_profile.interaction_count,
                "business_type": user_profile.business_type,
                "previous_interests": user_profile.interests
            }
            
            # Get relevant knowledge base articles
            kb_articles = self._get_relevant_knowledge(intent, entities)
            
            prompt = f"""
            You are an AI Super Agent for RocVille Media House, a premium digital agency. Generate a professional, helpful response based on the following:
            
            User Intent: {intent}
            Extracted Entities: {entities}
            User Context: {context}
            Knowledge Base: {kb_articles}
            Original Message: "{original_message}"
            
            Guidelines:
            - Be professional, friendly, and helpful
            - Provide specific information about our services when relevant
            - Ask qualifying questions for business inquiries
            - Offer next steps or call-to-action
            - Keep response concise but informative
            - Use the user's preferred language if specified
            - Include pricing estimates if budget is discussed
            - Suggest scheduling a consultation for complex projects
            
            Generate a response that addresses the user's needs and moves the conversation forward:
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback response
            return f"Thank you for your message! I'm here to help you with your digital needs. Could you tell me more about what specific services you're interested in? We specialize in web development, digital marketing, branding, UI/UX design, app development, and content creation."
    
    def _create_user_profile(self, phone_number: str) -> UserProfile:
        """Create new user profile"""
        profile = UserProfile(
            phone_number=phone_number,
            preferred_language='en',
            currency='USD',
            interaction_count=0,
            lead_score=0
        )
        db.session.add(profile)
        return profile
    
    def _update_lead_score(self, user_profile: UserProfile, intent: Dict):
        """Update lead score based on interaction"""
        score_increase = 0
        
        if intent.get('is_business_inquiry'):
            score_increase += 10
        
        if intent.get('urgency_level', 0) > 7:
            score_increase += 5
        
        if intent.get('service_interest'):
            score_increase += len(intent['service_interest']) * 3
        
        user_profile.lead_score = min(100, user_profile.lead_score + score_increase)
    
    def _create_autonomous_tasks(self, intent: Dict, entities: Dict, user_profile: UserProfile) -> List:
        """Create autonomous tasks based on conversation analysis"""
        tasks = []
        
        # Create follow-up task for high-value leads
        if user_profile.lead_score > 50 and intent.get('is_business_inquiry'):
            task_data = {
                "type": "follow_up",
                "user_profile": user_profile.to_dict(),
                "intent": intent,
                "entities": entities
            }
            # Task creation would be implemented here
            tasks.append(task_data)
        
        # Create email task if email provided
        if entities.get('email'):
            task_data = {
                "type": "send_email",
                "email": entities['email'],
                "template": "welcome_email",
                "personalization": {
                    "name": user_profile.name,
                    "services": intent.get('service_interest', [])
                }
            }
            tasks.append(task_data)
        
        return tasks
    
    def _get_relevant_knowledge(self, intent: Dict, entities: Dict) -> str:
        """Get relevant knowledge base articles"""
        # Query knowledge base based on intent and entities
        articles = KnowledgeBase.query.filter(
            KnowledgeBase.is_active == True
        ).limit(3).all()
        
        return "\n".join([f"- {article.title}: {article.content[:200]}..." for article in articles])
    
    def get_service_pricing(self, service_type: str, country_code: str = "US", custom_requirements: List[str] = None) -> Dict:
        """Generate location-based pricing for services"""
        if service_type not in self.services:
            return {"error": "Service not found"}
        
        service = self.services[service_type]
        base_price = service["base_price"]
        
        # Apply location multiplier
        multiplier = self.location_multipliers.get(country_code, 0.5)
        adjusted_price = int(base_price * multiplier)
        
        # Add complexity multiplier for custom requirements
        if custom_requirements:
            complexity_multiplier = 1 + (len(custom_requirements) * 0.1)
            adjusted_price = int(adjusted_price * complexity_multiplier)
        
        return {
            "service": service["name"],
            "base_price": base_price,
            "location_multiplier": multiplier,
            "adjusted_price": adjusted_price,
            "currency": "USD",
            "features": service["features"],
            "description": service["description"],
            "custom_requirements": custom_requirements or []
        }

