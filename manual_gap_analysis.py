#!/usr/bin/env python3
"""
Manual Gap Analysis - Precise Endpoint Comparison

Manual analysis of OpenAPI vs FastAPI implementation for more accurate results.
"""

def main():
    print("🔍 MANUAL GAP ANALYSIS - OpenAPI vs FastAPI Implementation")
    print("="*70)
    
    # OpenAPI Documented Endpoints (from openapi.yaml)
    openapi_endpoints = [
        ("GET", "/", "read_root"),
        ("GET", "/health", "health_check"),
        ("GET", "/compliance/check/{model}/{country}", "check_compliance"),
        ("GET", "/compliance/check-compliance", "check_compliance_legacy"),
        ("GET", "/compliance/models", "get_models"),
        ("GET", "/compliance/authorities", "get_authorities"), 
        ("GET", "/compliance/regulations/{model}/{country}", "get_regulations"),
        ("GET", "/compliance/aircraft", "get_aircraft"),
        ("GET", "/compliance/", "compliance_root"),
        ("GET", "/compliance/ai-analysis/{model}/{country}", "ai_enhanced_compliance_analysis"),
        ("GET", "/compliance/gap-analysis/{model}/{origin_country}/{target_country}", "regulatory_gap_analysis"),
        ("GET", "/analytics/fleet-metrics", "get_fleet_metrics"),
        ("GET", "/analytics/compliance-trends", "get_compliance_trends"),
        ("GET", "/analytics/alerts", "get_alerts"),
        ("GET", "/analytics/performance-metrics", "get_performance_metrics"),
        ("GET", "/analytics/requirements-summary", "get_requirements_summary"),
        ("GET", "/metrics", "get_metrics"),
        ("GET", "/metrics/health", "get_performance_health"),
        ("GET", "/cache/stats", "get_cache_stats"),
        ("DELETE", "/cache/compliance", "clear_compliance_cache"),
        ("DELETE", "/cache/compliance/{model}/{country}", "clear_specific_cache")
    ]
    
    # FastAPI Implemented Endpoints (from source code analysis)
    implemented_endpoints = [
        # From src/main.py
        ("GET", "/", None),
        ("GET", "/health", None),
        
        # From src/api/compliance.py (prefix: /compliance)
        ("GET", "/compliance/check/{model}/{country}", "check_compliance"),
        ("GET", "/compliance/check-compliance", None),  # Legacy endpoint
        ("GET", "/compliance/models", "get_supported_models"),
        ("GET", "/compliance/requirements/{model}/{country}", "get_requirements"),  # Different path!
        ("GET", "/compliance/authorities", "get_authorities"),
        ("GET", "/compliance/aircraft", "get_aircraft_models"),
        ("GET", "/compliance/health", "health_check"),  # Different path!
        ("GET", "/compliance/ai-analysis/{model}/{country}", "ai_enhanced_compliance_analysis"),
        ("GET", "/compliance/gap-analysis/{model}/{origin_country}/{target_country}", "regulatory_gap_analysis"),
        ("GET", "/compliance/", "compliance_root"),
        
        # From src/api/analytics.py (prefix: /analytics)
        ("GET", "/analytics/fleet-metrics", "get_fleet_metrics"),
        ("GET", "/analytics/compliance-trends", "get_compliance_trends"),
        ("GET", "/analytics/alerts", "get_active_alerts"),
        ("GET", "/analytics/performance-metrics", "get_performance_metrics"),
        ("GET", "/analytics/requirements-summary", "get_requirements_summary"),
        
        # From src/api/cache.py (prefix: /cache)
        ("GET", "/cache/stats", "get_cache_stats"),
        ("DELETE", "/cache/compliance", "clear_compliance_cache"),
        ("DELETE", "/cache/compliance/{model}/{country}", "clear_specific_cache"),
        
        # From src/api/metrics.py (prefix: /metrics)
        ("GET", "/metrics", "get_performance_metrics"),
        ("GET", "/metrics/{endpoint}", "get_specific_endpoint_metrics"),
        ("GET", "/metrics/health", "performance_health")
    ]
    
    print(f"📊 OpenAPI Documented: {len(openapi_endpoints)} endpoints")
    print(f"📊 FastAPI Implemented: {len(implemented_endpoints)} endpoints")
    
    # Convert to sets for comparison
    openapi_set = {(method, path) for method, path, _ in openapi_endpoints}
    impl_set = {(method, path) for method, path, _ in implemented_endpoints}
    
    # Find differences
    missing_in_impl = openapi_set - impl_set
    missing_in_openapi = impl_set - openapi_set
    common_endpoints = openapi_set & impl_set
    
    print(f"\n🎯 ANALYSIS RESULTS:")
    print(f"✅ Common Endpoints: {len(common_endpoints)}")
    print(f"🔴 Missing in Implementation: {len(missing_in_impl)}")
    print(f"📝 Missing in OpenAPI: {len(missing_in_openapi)}")
    
    # Show missing in implementation
    if missing_in_impl:
        print(f"\n🔴 MISSING IN IMPLEMENTATION ({len(missing_in_impl)}):")
        for method, path in sorted(missing_in_impl):
            # Find operation_id from original list
            op_id = next((op for m, p, op in openapi_endpoints if m == method and p == path), None)
            print(f"   - {method} {path} ({op_id or 'no operationId'})")
    
    # Show missing in OpenAPI  
    if missing_in_openapi:
        print(f"\n📝 MISSING IN OPENAPI ({len(missing_in_openapi)}):")
        for method, path in sorted(missing_in_openapi):
            # Find operation_id from original list
            op_id = next((op for m, p, op in implemented_endpoints if m == method and p == path), None)
            print(f"   - {method} {path} ({op_id or 'no operationId'})")
    
    # Check for operation_id mismatches in common endpoints
    print(f"\n⚠️  OPERATION ID MISMATCHES:")
    mismatches = []
    
    for method, path in common_endpoints:
        openapi_op = next((op for m, p, op in openapi_endpoints if m == method and p == path), None)
        impl_op = next((op for m, p, op in implemented_endpoints if m == method and p == path), None)
        
        if openapi_op != impl_op:
            mismatches.append((method, path, openapi_op, impl_op))
    
    if mismatches:
        for method, path, openapi_op, impl_op in mismatches:
            print(f"   - {method} {path}: '{openapi_op}' vs '{impl_op}'")
    else:
        print("   ✅ No operation ID mismatches found!")
    
    # Detailed analysis of specific discrepancies
    print(f"\n🔍 DETAILED ANALYSIS:")
    
    # Check for path differences that might be the same endpoint
    print("\n🔎 Potential Path Mismatches:")
    potential_matches = [
        ("/compliance/regulations/{model}/{country}", "/compliance/requirements/{model}/{country}"),
        ("/metrics/health", "/compliance/health")
    ]
    
    for openapi_path, impl_path in potential_matches:
        if ("GET", openapi_path) in openapi_set and ("GET", impl_path) in impl_set:
            print(f"   - OpenAPI: GET {openapi_path}")
            print(f"     Impl:    GET {impl_path}")
            print(f"     Status:  🤔 Might be the same endpoint with different paths")
    
    print(f"\n🎯 SUMMARY & RECOMMENDATIONS:")
    print(f"1. ✅ Most endpoints are properly implemented ({len(common_endpoints)}/{len(openapi_endpoints)})")
    
    if missing_in_impl:
        print(f"2. 🔴 {len(missing_in_impl)} endpoints need implementation")
    
    if missing_in_openapi:
        print(f"3. 📝 {len(missing_in_openapi)} endpoints need OpenAPI documentation")
    
    if mismatches:
        print(f"4. ⚠️  {len(mismatches)} operation ID mismatches need fixing")
    
    print(f"\n📈 COMPLIANCE SCORE: {len(common_endpoints)}/{len(openapi_endpoints)} = {len(common_endpoints)/len(openapi_endpoints)*100:.1f}%")
    
    print("="*70)

if __name__ == "__main__":
    main()