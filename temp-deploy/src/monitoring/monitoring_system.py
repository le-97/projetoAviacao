"""
Advanced monitoring and observability system for Aviation Compliance API.
"""
import time
import psutil
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from collections import defaultdict, deque
import json
import statistics

@dataclass
class MetricData:
    """Container for metric data points."""
    timestamp: float
    value: float
    labels: Dict[str, str] = field(default_factory=dict)

@dataclass
class AlertRule:
    """Alert rule configuration."""
    name: str
    metric: str
    threshold: float
    operator: str  # 'gt', 'lt', 'eq'
    duration: int  # seconds
    severity: str  # 'critical', 'warning', 'info'
    enabled: bool = True

class MetricsCollector:
    """Collects and stores application metrics."""
    
    def __init__(self, retention_hours: int = 24):
        self.metrics: Dict[str, deque] = defaultdict(lambda: deque(maxlen=retention_hours * 3600))
        self.counters: Dict[str, float] = defaultdict(float)
        self.gauges: Dict[str, float] = defaultdict(float)
        self.histograms: Dict[str, List[float]] = defaultdict(list)
        self.retention_hours = retention_hours
        self._lock = threading.Lock()
    
    def counter(self, name: str, value: float = 1, labels: Dict[str, str] = None):
        """Increment a counter metric."""
        with self._lock:
            key = self._make_key(name, labels)
            self.counters[key] += value
            self._record_metric(name, self.counters[key], labels)
    
    def gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set a gauge metric value."""
        with self._lock:
            key = self._make_key(name, labels)
            self.gauges[key] = value
            self._record_metric(name, value, labels)
    
    def histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Record a histogram value."""
        with self._lock:
            key = self._make_key(name, labels)
            self.histograms[key].append(value)
            # Keep only last 1000 values
            if len(self.histograms[key]) > 1000:
                self.histograms[key] = self.histograms[key][-1000:]
            self._record_metric(name, value, labels)
    
    def timer(self, name: str, labels: Dict[str, str] = None):
        """Context manager for timing operations."""
        return TimerContext(self, name, labels)
    
    def _make_key(self, name: str, labels: Dict[str, str] = None) -> str:
        """Create a unique key for metric with labels."""
        if not labels:
            return name
        label_str = ",".join(f"{k}={v}" for k, v in sorted(labels.items()))
        return f"{name}{{{label_str}}}"
    
    def _record_metric(self, name: str, value: float, labels: Dict[str, str] = None):
        """Record a metric data point."""
        metric_data = MetricData(
            timestamp=time.time(),
            value=value,
            labels=labels or {}
        )
        self.metrics[name].append(metric_data)
    
    def get_metric_stats(self, name: str, duration_minutes: int = 60) -> Dict[str, Any]:
        """Get statistics for a metric over the specified duration."""
        if name not in self.metrics:
            return {}
        
        cutoff_time = time.time() - (duration_minutes * 60)
        recent_values = [
            point.value for point in self.metrics[name]
            if point.timestamp >= cutoff_time
        ]
        
        if not recent_values:
            return {}
        
        return {
            "count": len(recent_values),
            "min": min(recent_values),
            "max": max(recent_values),
            "mean": statistics.mean(recent_values),
            "median": statistics.median(recent_values),
            "p95": self._percentile(recent_values, 95),
            "p99": self._percentile(recent_values, 99)
        }
    
    def _percentile(self, values: List[float], percentile: int) -> float:
        """Calculate percentile value."""
        if not values:
            return 0.0
        sorted_values = sorted(values)
        index = int((percentile / 100.0) * len(sorted_values))
        return sorted_values[min(index, len(sorted_values) - 1)]

class TimerContext:
    """Context manager for timing operations."""
    
    def __init__(self, collector: MetricsCollector, name: str, labels: Dict[str, str] = None):
        self.collector = collector
        self.name = name
        self.labels = labels
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            duration = time.time() - self.start_time
            self.collector.histogram(self.name, duration, self.labels)

class SystemMonitor:
    """Monitors system resources and performance."""
    
    def __init__(self, collector: MetricsCollector):
        self.collector = collector
        self.monitoring = False
        self.monitor_thread = None
    
    def start_monitoring(self, interval: int = 30):
        """Start system monitoring with specified interval."""
        if self.monitoring:
            return
        
        self.monitoring = True
        self.monitor_thread = threading.Thread(target=self._monitor_loop, args=(interval,))
        self.monitor_thread.daemon = True
        self.monitor_thread.start()
    
    def stop_monitoring(self):
        """Stop system monitoring."""
        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()
    
    def _monitor_loop(self, interval: int):
        """Main monitoring loop."""
        while self.monitoring:
            try:
                self._collect_system_metrics()
                time.sleep(interval)
            except Exception as e:
                print(f"Error in system monitoring: {e}")
                time.sleep(interval)
    
    def _collect_system_metrics(self):
        """Collect system performance metrics."""
        # CPU metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        self.collector.gauge("system_cpu_percent", cpu_percent)
        
        # Memory metrics
        memory = psutil.virtual_memory()
        self.collector.gauge("system_memory_used_bytes", memory.used)
        self.collector.gauge("system_memory_percent", memory.percent)
        
        # Disk metrics
        disk = psutil.disk_usage('/')
        self.collector.gauge("system_disk_used_bytes", disk.used)
        self.collector.gauge("system_disk_percent", (disk.used / disk.total) * 100)
        
        # Network metrics (if available)
        try:
            network = psutil.net_io_counters()
            self.collector.counter("system_network_bytes_sent", network.bytes_sent)
            self.collector.counter("system_network_bytes_received", network.bytes_recv)
        except Exception:
            pass  # Network metrics not available

class ApplicationMonitor:
    """Monitors application-specific metrics."""
    
    def __init__(self, collector: MetricsCollector):
        self.collector = collector
        self.start_time = time.time()
    
    def record_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request metrics."""
        labels = {
            "method": method,
            "endpoint": endpoint,
            "status_code": str(status_code)
        }
        
        self.collector.counter("http_requests_total", 1, labels)
        self.collector.histogram("http_request_duration_seconds", duration, labels)
        
        # Track error rates
        if status_code >= 400:
            self.collector.counter("http_errors_total", 1, labels)
    
    def record_database_query(self, operation: str, table: str, duration: float, success: bool):
        """Record database query metrics."""
        labels = {
            "operation": operation,
            "table": table,
            "success": str(success)
        }
        
        self.collector.counter("database_queries_total", 1, labels)
        self.collector.histogram("database_query_duration_seconds", duration, labels)
        
        if not success:
            self.collector.counter("database_errors_total", 1, labels)
    
    def record_compliance_check(self, model: str, country: str, duration: float, success: bool):
        """Record compliance check metrics."""
        labels = {
            "aircraft_model": model,
            "country": country,
            "success": str(success)
        }
        
        self.collector.counter("compliance_checks_total", 1, labels)
        self.collector.histogram("compliance_check_duration_seconds", duration, labels)
        
        if not success:
            self.collector.counter("compliance_check_errors_total", 1, labels)
    
    def get_uptime(self) -> float:
        """Get application uptime in seconds."""
        return time.time() - self.start_time

class AlertManager:
    """Manages alerting based on metric thresholds."""
    
    def __init__(self, collector: MetricsCollector):
        self.collector = collector
        self.rules: List[AlertRule] = []
        self.active_alerts: Dict[str, datetime] = {}
        self.alert_history: List[Dict] = []
    
    def add_rule(self, rule: AlertRule):
        """Add an alert rule."""
        self.rules.append(rule)
    
    def check_alerts(self):
        """Check all alert rules and trigger alerts if needed."""
        current_time = datetime.utcnow()
        
        for rule in self.rules:
            if not rule.enabled:
                continue
            
            try:
                should_alert = self._evaluate_rule(rule)
                
                if should_alert and rule.name not in self.active_alerts:
                    self._trigger_alert(rule, current_time)
                elif not should_alert and rule.name in self.active_alerts:
                    self._resolve_alert(rule, current_time)
                    
            except Exception as e:
                print(f"Error evaluating alert rule {rule.name}: {e}")
    
    def _evaluate_rule(self, rule: AlertRule) -> bool:
        """Evaluate if an alert rule should trigger."""
        stats = self.collector.get_metric_stats(rule.metric, duration_minutes=int(rule.duration / 60))
        
        if not stats:
            return False
        
        value = stats.get("mean", 0)  # Use mean value for evaluation
        
        if rule.operator == "gt":
            return value > rule.threshold
        elif rule.operator == "lt":
            return value < rule.threshold
        elif rule.operator == "eq":
            return abs(value - rule.threshold) < 0.001
        
        return False
    
    def _trigger_alert(self, rule: AlertRule, timestamp: datetime):
        """Trigger an alert."""
        self.active_alerts[rule.name] = timestamp
        
        alert_event = {
            "rule_name": rule.name,
            "metric": rule.metric,
            "threshold": rule.threshold,
            "severity": rule.severity,
            "timestamp": timestamp.isoformat(),
            "status": "triggered"
        }
        
        self.alert_history.append(alert_event)
        print(f"🚨 ALERT [{rule.severity.upper()}]: {rule.name} - {rule.metric} threshold exceeded")
    
    def _resolve_alert(self, rule: AlertRule, timestamp: datetime):
        """Resolve an alert."""
        if rule.name in self.active_alerts:
            del self.active_alerts[rule.name]
        
        alert_event = {
            "rule_name": rule.name,
            "metric": rule.metric,
            "severity": rule.severity,
            "timestamp": timestamp.isoformat(),
            "status": "resolved"
        }
        
        self.alert_history.append(alert_event)
        print(f"✅ RESOLVED [{rule.severity.upper()}]: {rule.name} - {rule.metric} back to normal")

class HealthChecker:
    """Application health check system."""
    
    def __init__(self):
        self.checks: Dict[str, callable] = {}
    
    def register_check(self, name: str, check_func: callable):
        """Register a health check function."""
        self.checks[name] = check_func
    
    def run_checks(self) -> Dict[str, Any]:
        """Run all health checks and return results."""
        results = {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "checks": {}
        }
        
        overall_healthy = True
        
        for name, check_func in self.checks.items():
            try:
                start_time = time.time()
                check_result = check_func()
                duration = time.time() - start_time
                
                if isinstance(check_result, bool):
                    check_result = {"healthy": check_result}
                
                check_result["duration_ms"] = round(duration * 1000, 2)
                results["checks"][name] = check_result
                
                if not check_result.get("healthy", False):
                    overall_healthy = False
                    
            except Exception as e:
                results["checks"][name] = {
                    "healthy": False,
                    "error": str(e),
                    "duration_ms": 0
                }
                overall_healthy = False
        
        results["status"] = "healthy" if overall_healthy else "unhealthy"
        return results

# Global monitoring instances
metrics_collector = MetricsCollector()
system_monitor = SystemMonitor(metrics_collector)
app_monitor = ApplicationMonitor(metrics_collector)
alert_manager = AlertManager(metrics_collector)
health_checker = HealthChecker()

# Default alert rules
default_alert_rules = [
    AlertRule(
        name="high_cpu_usage",
        metric="system_cpu_percent",
        threshold=80.0,
        operator="gt",
        duration=300,  # 5 minutes
        severity="warning"
    ),
    AlertRule(
        name="high_memory_usage",
        metric="system_memory_percent", 
        threshold=90.0,
        operator="gt",
        duration=300,
        severity="critical"
    ),
    AlertRule(
        name="high_error_rate",
        metric="http_errors_total",
        threshold=10.0,
        operator="gt",
        duration=180,  # 3 minutes
        severity="critical"
    ),
    AlertRule(
        name="slow_response_time",
        metric="http_request_duration_seconds",
        threshold=2.0,
        operator="gt",
        duration=300,
        severity="warning"
    )
]

# Add default rules
for rule in default_alert_rules:
    alert_manager.add_rule(rule)

# Export monitoring components
__all__ = [
    "metrics_collector",
    "system_monitor", 
    "app_monitor",
    "alert_manager",
    "health_checker",
    "MetricsCollector",
    "SystemMonitor",
    "ApplicationMonitor", 
    "AlertManager",
    "HealthChecker",
    "AlertRule"
]