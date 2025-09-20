"""
Locust load testing script for compliance microservice.

Provides realistic load testing scenarios with varying
user behaviors and request patterns.
"""

from locust import HttpUser, task, between, events
import random


class ComplianceUser(HttpUser):
    """User behavior for compliance checking."""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    # Test data
    models = ["E190", "E195"]
    countries = ["USA", "BRAZIL", "EUROPE"]
    
    def on_start(self):
        """Called when a user starts."""
        # Test health endpoint first
        self.client.get("/health")
    
    @task(10)  # 10x weight for compliance requests
    def check_compliance(self):
        """Main compliance checking task."""
        model = random.choice(self.models)
        country = random.choice(self.countries)
        
        with self.client.get(
            "/check-compliance",
            params={"model": model, "country": country},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed with status {response.status_code}")
    
    @task(2)  # Lower weight for metrics
    def check_metrics(self):
        """Check metrics endpoint."""
        self.client.get("/metrics")
    
    @task(1)  # Lowest weight for health
    def check_health(self):
        """Check health endpoint."""
        self.client.get("/health")


class PowerUser(HttpUser):
    """Power user with more frequent requests."""
    
    wait_time = between(0.5, 1.5)  # Faster requests
    
    models = ["E190", "E195"]
    countries = ["USA", "BRAZIL", "EUROPE"]
    
    @task(15)  # Higher weight for compliance
    def check_compliance_frequently(self):
        """Frequent compliance checking."""
        model = random.choice(self.models)
        country = random.choice(self.countries)
        
        self.client.get("/check-compliance", params={"model": model, "country": country})
    
    @task(1)
    def check_cache_stats(self):
        """Check cache statistics."""
        self.client.get("/cache/stats")


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when the test starts."""
    print("🚀 Starting load test for compliance microservice...")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when the test stops."""
    print("✅ Load test completed!")
    
    # Print summary statistics
    stats = environment.stats
    print(f"📊 Summary:")
    print(f"  Total requests: {stats.total.num_requests}")
    print(f"  Failures: {stats.total.num_failures}")
    print(f"  Average response time: {stats.total.avg_response_time:.2f}ms")
    print(f"  95th percentile: {stats.total.get_response_time_percentile(0.95):.2f}ms")
    print(f"  Requests per second: {stats.total.total_rps:.2f}")


# Custom load shapes for different testing scenarios
from locust import LoadTestShape

class StepLoadShape(LoadTestShape):
    """Step load pattern for gradual ramp-up."""
    
    step_time = 30  # 30 seconds per step
    step_load = 5   # Add 5 users per step
    max_users = 50  # Maximum users
    
    def tick(self):
        """Define the load at each moment."""
        run_time = self.get_run_time()
        
        if run_time < self.step_time:
            return (self.step_load, self.step_load)
        
        current_step = run_time // self.step_time
        current_users = min(current_step * self.step_load, self.max_users)
        
        if current_users >= self.max_users:
            return None  # Stop the test
        
        return (current_users, self.step_load)


class SpikeLoadShape(LoadTestShape):
    """Spike load pattern for stress testing."""
    
    def tick(self):
        """Create traffic spikes."""
        run_time = self.get_run_time()
        
        if run_time < 60:
            return (10, 10)  # Normal load
        elif run_time < 90:
            return (50, 50)  # Spike
        elif run_time < 150:
            return (10, 10)  # Back to normal
        elif run_time < 180:
            return (100, 100)  # Bigger spike
        else:
            return None  # Stop test