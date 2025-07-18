import pytest
from performance import PerformanceConfig, CacheManager, PerformanceMonitor

def test_cache_set_and_get():
    cache = CacheManager()
    cache.set('foo', 'bar', timeout=10)
    assert cache.get('foo') == 'bar'

def test_performance_metrics():
    monitor = PerformanceMonitor()
    monitor.record_request(0.1, endpoint='test')
    metrics = monitor.get_metrics()
    assert metrics['total_requests'] == 1
    assert metrics['avg_request_duration_ms'] > 0
