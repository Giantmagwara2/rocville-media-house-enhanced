import os
import time
import functools
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import json
import hashlib

class PerformanceConfig:
    """Performance optimization configuration"""
    
    # Cache Configuration
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'simple')  # simple, redis, memcached
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', '300'))  # 5 minutes
    CACHE_KEY_PREFIX = 'rocville_ai_'
    
    # Cache timeouts for different data types
    CACHE_TIMEOUTS = {
        'user_profile': 3600,      # 1 hour
        'conversation': 1800,      # 30 minutes
        'translation': 86400,      # 24 hours
        'location': 3600,          # 1 hour
        'pricing': 7200,           # 2 hours
        'ai_response': 300,        # 5 minutes
        'analytics': 1800          # 30 minutes
    }
    
    # Database Connection Pool
    DB_POOL_SIZE = int(os.getenv('DB_POOL_SIZE', '10'))
    DB_POOL_TIMEOUT = int(os.getenv('DB_POOL_TIMEOUT', '30'))
    DB_POOL_RECYCLE = int(os.getenv('DB_POOL_RECYCLE', '3600'))
    
    # API Rate Limiting
    API_RATE_LIMIT_STORAGE = os.getenv('RATE_LIMIT_STORAGE', 'memory')
    
    # Background Task Configuration
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    # Monitoring Configuration
    ENABLE_METRICS = os.getenv('ENABLE_METRICS', 'true').lower() == 'true'
    METRICS_PORT = int(os.getenv('METRICS_PORT', '9090'))

class CacheManager:
    """Cache manager for performance optimization"""
    
    def __init__(self):
        self.cache = {}  # Simple in-memory cache for development
        self.cache_stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0
        }
    
    def _generate_key(self, key: str, prefix: str = None) -> str:
        """Generate cache key with prefix"""
        if prefix:
            return f"{PerformanceConfig.CACHE_KEY_PREFIX}{prefix}:{key}"
        return f"{PerformanceConfig.CACHE_KEY_PREFIX}{key}"
    
    def get(self, key: str, prefix: str = None) -> Optional[Any]:
        """Get value from cache"""
        cache_key = self._generate_key(key, prefix)
        
        if cache_key in self.cache:
            entry = self.cache[cache_key]
            if entry['expires'] > time.time():
                self.cache_stats['hits'] += 1
                return entry['value']
            else:
                # Expired entry
                del self.cache[cache_key]
        
        self.cache_stats['misses'] += 1
        return None
    
    def set(self, key: str, value: Any, timeout: int = None, prefix: str = None) -> bool:
        """Set value in cache"""
        if timeout is None:
            timeout = PerformanceConfig.CACHE_DEFAULT_TIMEOUT
        
        cache_key = self._generate_key(key, prefix)
        expires = time.time() + timeout
        
        self.cache[cache_key] = {
            'value': value,
            'expires': expires,
            'created': time.time()
        }
        
        self.cache_stats['sets'] += 1
        return True
    
    def delete(self, key: str, prefix: str = None) -> bool:
        """Delete value from cache"""
        cache_key = self._generate_key(key, prefix)
        
        if cache_key in self.cache:
            del self.cache[cache_key]
            self.cache_stats['deletes'] += 1
            return True
        
        return False
    
    def clear(self, prefix: str = None) -> bool:
        """Clear cache entries"""
        if prefix:
            prefix_key = f"{PerformanceConfig.CACHE_KEY_PREFIX}{prefix}:"
            keys_to_delete = [k for k in self.cache.keys() if k.startswith(prefix_key)]
            for key in keys_to_delete:
                del self.cache[key]
        else:
            self.cache.clear()
        
        return True
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.cache_stats['hits'] + self.cache_stats['misses']
        hit_rate = (self.cache_stats['hits'] / total_requests * 100) if total_requests > 0 else 0
        
        return {
            **self.cache_stats,
            'total_requests': total_requests,
            'hit_rate': round(hit_rate, 2),
            'cache_size': len(self.cache)
        }

# Global cache instance
cache_manager = CacheManager()

def cached(timeout: int = None, prefix: str = None, key_func=None):
    """Decorator for caching function results"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            if key_func:
                cache_key = key_func(*args, **kwargs)
            else:
                # Default key generation
                key_parts = [func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}:{v}" for k, v in sorted(kwargs.items()))
                cache_key = hashlib.md5(":".join(key_parts).encode()).hexdigest()
            
            # Try to get from cache
            cached_result = cache_manager.get(cache_key, prefix)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache_timeout = timeout or PerformanceConfig.CACHE_TIMEOUTS.get(prefix, PerformanceConfig.CACHE_DEFAULT_TIMEOUT)
            cache_manager.set(cache_key, result, cache_timeout, prefix)
            
            return result
        
        return wrapper
    return decorator

class PerformanceMonitor:
    """Performance monitoring and metrics collection"""
    
    def __init__(self):
        self.metrics = {
            'request_count': 0,
            'request_duration': [],
            'ai_processing_time': [],
            'db_query_time': [],
            'cache_operations': 0,
            'errors': 0,
            'active_connections': 0
        }
        self.start_time = time.time()
    
    def record_request(self, duration: float, endpoint: str = None):
        """Record request metrics"""
        self.metrics['request_count'] += 1
        self.metrics['request_duration'].append({
            'duration': duration,
            'endpoint': endpoint,
            'timestamp': time.time()
        })
        
        # Keep only last 1000 requests to prevent memory issues
        if len(self.metrics['request_duration']) > 1000:
            self.metrics['request_duration'] = self.metrics['request_duration'][-1000:]
    
    def record_ai_processing(self, duration: float, model: str = None):
        """Record AI processing metrics"""
        self.metrics['ai_processing_time'].append({
            'duration': duration,
            'model': model,
            'timestamp': time.time()
        })
        
        # Keep only last 500 AI processing records
        if len(self.metrics['ai_processing_time']) > 500:
            self.metrics['ai_processing_time'] = self.metrics['ai_processing_time'][-500:]
    
    def record_db_query(self, duration: float, query_type: str = None):
        """Record database query metrics"""
        self.metrics['db_query_time'].append({
            'duration': duration,
            'query_type': query_type,
            'timestamp': time.time()
        })
        
        # Keep only last 500 DB query records
        if len(self.metrics['db_query_time']) > 500:
            self.metrics['db_query_time'] = self.metrics['db_query_time'][-500:]
    
    def record_error(self, error_type: str = None):
        """Record error metrics"""
        self.metrics['errors'] += 1
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics"""
        now = time.time()
        uptime = now - self.start_time
        
        # Calculate averages
        avg_request_duration = 0
        if self.metrics['request_duration']:
            avg_request_duration = sum(r['duration'] for r in self.metrics['request_duration']) / len(self.metrics['request_duration'])
        
        avg_ai_processing = 0
        if self.metrics['ai_processing_time']:
            avg_ai_processing = sum(r['duration'] for r in self.metrics['ai_processing_time']) / len(self.metrics['ai_processing_time'])
        
        avg_db_query = 0
        if self.metrics['db_query_time']:
            avg_db_query = sum(r['duration'] for r in self.metrics['db_query_time']) / len(self.metrics['db_query_time'])
        
        # Calculate requests per second
        requests_per_second = self.metrics['request_count'] / uptime if uptime > 0 else 0
        
        return {
            'uptime_seconds': round(uptime, 2),
            'total_requests': self.metrics['request_count'],
            'requests_per_second': round(requests_per_second, 2),
            'avg_request_duration_ms': round(avg_request_duration * 1000, 2),
            'avg_ai_processing_ms': round(avg_ai_processing * 1000, 2),
            'avg_db_query_ms': round(avg_db_query * 1000, 2),
            'total_errors': self.metrics['errors'],
            'cache_stats': cache_manager.get_stats(),
            'active_connections': self.metrics['active_connections']
        }

# Global performance monitor instance
performance_monitor = PerformanceMonitor()

def monitor_performance(func_type: str = 'request'):
    """Decorator for monitoring function performance"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                
                if func_type == 'request':
                    performance_monitor.record_request(duration, func.__name__)
                elif func_type == 'ai':
                    performance_monitor.record_ai_processing(duration)
                elif func_type == 'db':
                    performance_monitor.record_db_query(duration)
                
                return result
            
            except Exception as e:
                performance_monitor.record_error(type(e).__name__)
                raise
        
        return wrapper
    return decorator

class DatabaseOptimizer:
    """Database optimization utilities"""
    
    @staticmethod
    def optimize_query(query_func):
        """Decorator for optimizing database queries"""
        @functools.wraps(query_func)
        @monitor_performance('db')
        def wrapper(*args, **kwargs):
            return query_func(*args, **kwargs)
        return wrapper
    
    @staticmethod
    def batch_insert(model_class, data_list, batch_size=100):
        """Optimized batch insert for large datasets"""
        from src.models.user import db
        
        for i in range(0, len(data_list), batch_size):
            batch = data_list[i:i + batch_size]
            db.session.bulk_insert_mappings(model_class, batch)
            db.session.commit()
    
    @staticmethod
    def get_connection_pool_stats():
        """Get database connection pool statistics"""
        # This would integrate with SQLAlchemy pool in production
        return {
            'pool_size': PerformanceConfig.DB_POOL_SIZE,
            'checked_out': 0,  # Would get from actual pool
            'overflow': 0,     # Would get from actual pool
            'checked_in': 0    # Would get from actual pool
        }

class AsyncTaskManager:
    """Manager for asynchronous background tasks"""
    
    def __init__(self):
        self.task_queue = []
        self.completed_tasks = []
    
    def add_task(self, task_func, *args, **kwargs):
        """Add task to background queue"""
        task = {
            'id': hashlib.md5(f"{task_func.__name__}{time.time()}".encode()).hexdigest(),
            'function': task_func,
            'args': args,
            'kwargs': kwargs,
            'created_at': time.time(),
            'status': 'pending'
        }
        
        self.task_queue.append(task)
        return task['id']
    
    def process_tasks(self):
        """Process pending tasks (simplified implementation)"""
        for task in self.task_queue[:]:
            try:
                task['status'] = 'running'
                result = task['function'](*task['args'], **task['kwargs'])
                task['status'] = 'completed'
                task['result'] = result
                task['completed_at'] = time.time()
                
                self.completed_tasks.append(task)
                self.task_queue.remove(task)
                
            except Exception as e:
                task['status'] = 'failed'
                task['error'] = str(e)
                task['failed_at'] = time.time()
    
    def get_task_status(self, task_id):
        """Get status of a specific task"""
        for task in self.task_queue + self.completed_tasks:
            if task['id'] == task_id:
                return {
                    'id': task['id'],
                    'status': task['status'],
                    'created_at': task['created_at']
                }
        return None

# Global task manager instance
task_manager = AsyncTaskManager()

def background_task(func):
    """Decorator to run function as background task"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return task_manager.add_task(func, *args, **kwargs)
    return wrapper

# Performance optimization utilities
def optimize_json_response(data):
    """Optimize JSON response for better performance"""
    # Remove None values to reduce payload size
    if isinstance(data, dict):
        return {k: v for k, v in data.items() if v is not None}
    elif isinstance(data, list):
        return [optimize_json_response(item) for item in data if item is not None]
    return data

def compress_response(response_data):
    """Compress response data for better network performance"""
    import gzip
    import json
    
    json_str = json.dumps(response_data)
    compressed = gzip.compress(json_str.encode('utf-8'))
    
    return {
        'compressed': True,
        'data': compressed.hex(),
        'original_size': len(json_str),
        'compressed_size': len(compressed)
    }

