#!/usr/bin/env python3
"""
Gap Analysis Tool - OpenAPI vs FastAPI Implementation Comparison (No External Dependencies)

This script performs automated comparison between OpenAPI specification and
the actual FastAPI implementation using only standard library modules.
"""

import os
import re
import json
import ast
from pathlib import Path
from typing import Dict, List, Set, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import sys


@dataclass
class EndpointInfo:
    """Information about an API endpoint."""
    path: str
    method: str
    operation_id: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = None
    source: str = "unknown"  # 'openapi' or 'implementation'
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []


@dataclass
class GapAnalysisResult:
    """Results of gap analysis between OpenAPI and implementation."""
    missing_in_implementation: List[EndpointInfo]
    missing_in_openapi: List[EndpointInfo]
    mismatched_endpoints: List[Tuple[EndpointInfo, EndpointInfo, List[str]]]
    total_openapi_endpoints: int
    total_implementation_endpoints: int
    analysis_timestamp: str


class SimpleYAMLParser:
    """Simple YAML parser for basic OpenAPI parsing (paths section only)."""
    
    @staticmethod
    def extract_paths_from_yaml(yaml_content: str) -> Dict[str, Any]:
        """Extract paths section from YAML content using regex."""
        paths = {}
        
        # Find paths section
        paths_match = re.search(r'^paths:\s*$', yaml_content, re.MULTILINE)
        if not paths_match:
            return paths
        
        # Extract everything after "paths:" until next top-level key
        start_pos = paths_match.end()
        
        # Find next top-level section (components, etc.)
        next_section = re.search(r'\n(\w+):\s*$', yaml_content[start_pos:], re.MULTILINE)
        end_pos = start_pos + next_section.start() if next_section else len(yaml_content)
        
        paths_section = yaml_content[start_pos:end_pos]
        
        # Parse paths using regex
        path_pattern = r'^\s{2}(/[^:]*):$'
        method_pattern = r'^\s{4}(get|post|put|delete|patch|head|options):$'
        field_pattern = r'^\s{6}(\w+):\s*(.+)$'
        
        current_path = None
        current_method = None
        
        for line in paths_section.split('\n'):
            # Check for path
            path_match = re.match(path_pattern, line)
            if path_match:
                current_path = path_match.group(1)
                if current_path not in paths:
                    paths[current_path] = {}
                continue
            
            # Check for method
            method_match = re.match(method_pattern, line)
            if method_match and current_path:
                current_method = method_match.group(1)
                paths[current_path][current_method] = {}
                continue
            
            # Check for fields (operationId, summary, etc.)
            field_match = re.match(field_pattern, line)
            if field_match and current_path and current_method:
                field_name = field_match.group(1)
                field_value = field_match.group(2).strip().strip('"\'')
                
                # Handle tags (simple list parsing)
                if field_name == 'tags':
                    continue  # Skip tags for now
                
                paths[current_path][current_method][field_name] = field_value
        
        return paths


class OpenAPIExtractor:
    """Extracts endpoint information from OpenAPI specification."""
    
    def __init__(self, openapi_file: str):
        self.openapi_file = openapi_file
        self.paths = self._load_openapi_paths()
    
    def _load_openapi_paths(self) -> Dict[str, Any]:
        """Load and parse OpenAPI paths section."""
        try:
            with open(self.openapi_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if self.openapi_file.endswith('.json'):
                spec = json.loads(content)
                return spec.get('paths', {})
            else:
                # Use simple YAML parser
                return SimpleYAMLParser.extract_paths_from_yaml(content)
                
        except Exception as e:
            print(f"Error loading OpenAPI spec from {self.openapi_file}: {e}")
            return {}
    
    def extract_endpoints(self) -> List[EndpointInfo]:
        """Extract all endpoints from OpenAPI specification."""
        endpoints = []
        
        for path, path_info in self.paths.items():
            for method, operation in path_info.items():
                if method.lower() in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                    endpoint = EndpointInfo(
                        path=path,
                        method=method.upper(),
                        operation_id=operation.get('operationId'),
                        summary=operation.get('summary'),
                        description=operation.get('description'),
                        tags=[],  # Simplified for now
                        source='openapi'
                    )
                    endpoints.append(endpoint)
        
        return endpoints


class FastAPIExtractor:
    """Extracts endpoint information from FastAPI implementation."""
    
    def __init__(self, src_dir: str = "src"):
        self.src_dir = Path(src_dir)
        self.endpoints = []
    
    def extract_endpoints(self) -> List[EndpointInfo]:
        """Extract all endpoints from FastAPI implementation."""
        self.endpoints = []
        
        # Extract from main.py (root endpoints)
        main_file = self.src_dir / "main.py"
        if main_file.exists():
            self._extract_from_file(main_file, "")
        
        # Extract from API router files
        api_dir = self.src_dir / "api"
        if api_dir.exists():
            for api_file in api_dir.glob("*.py"):
                if api_file.name != "__init__.py":
                    # Determine router prefix from file content
                    prefix = self._get_router_prefix(api_file)
                    self._extract_from_file(api_file, prefix)
        
        return self.endpoints
    
    def _get_router_prefix(self, file_path: Path) -> str:
        """Extract router prefix from APIRouter definition."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Look for router = APIRouter(prefix="...")
            prefix_match = re.search(r'APIRouter\([^)]*prefix=["\']([^"\']*)["\']', content)
            if prefix_match:
                return prefix_match.group(1)
                
            # Fallback: guess from filename
            filename = file_path.stem
            if filename in ['compliance', 'analytics', 'cache', 'metrics']:
                return f"/{filename}"
                
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
        
        return ""
    
    def _extract_from_file(self, file_path: Path, router_prefix: str):
        """Extract endpoints from a single Python file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Use regex to find route decorators (simpler than AST)
            route_pattern = r'@(?:router|app)\.(get|post|put|delete|patch|head|options)\([^)]*["\']([^"\']+)["\'][^)]*\)'
            
            for match in re.finditer(route_pattern, content):
                method = match.group(1).upper()
                path = match.group(2)
                
                # Add router prefix
                full_path = router_prefix + path if router_prefix else path
                
                # Try to extract operation_id from the same line or following lines
                line_start = content.rfind('\n', 0, match.start()) + 1
                line_end = content.find('\n', match.end())
                if line_end == -1:
                    line_end = len(content)
                
                decorator_line = content[line_start:line_end]
                
                # Extract operation_id
                operation_id = None
                op_id_match = re.search(r'operation_id=["\']([^"\']+)["\']', decorator_line)
                if op_id_match:
                    operation_id = op_id_match.group(1)
                
                # Extract summary
                summary = None
                summary_match = re.search(r'summary=["\']([^"\']+)["\']', decorator_line)
                if summary_match:
                    summary = summary_match.group(1)
                
                endpoint = EndpointInfo(
                    path=full_path,
                    method=method,
                    operation_id=operation_id,
                    summary=summary,
                    source='implementation'
                )
                self.endpoints.append(endpoint)
                        
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")


class GapAnalyzer:
    """Performs gap analysis between OpenAPI spec and FastAPI implementation."""
    
    def __init__(self, openapi_file: str, src_dir: str = "src"):
        self.openapi_extractor = OpenAPIExtractor(openapi_file)
        self.fastapi_extractor = FastAPIExtractor(src_dir)
    
    def analyze(self) -> GapAnalysisResult:
        """Perform complete gap analysis."""
        print("🔍 Extracting endpoints from OpenAPI specification...")
        openapi_endpoints = self.openapi_extractor.extract_endpoints()
        
        print("🔍 Extracting endpoints from FastAPI implementation...")
        impl_endpoints = self.fastapi_extractor.extract_endpoints()
        
        print(f"📊 Found {len(openapi_endpoints)} endpoints in OpenAPI spec")
        print(f"📊 Found {len(impl_endpoints)} endpoints in implementation")
        
        # Create endpoint maps for comparison
        openapi_map = self._create_endpoint_map(openapi_endpoints)
        impl_map = self._create_endpoint_map(impl_endpoints)
        
        # Find missing endpoints
        missing_in_impl = []
        missing_in_openapi = []
        mismatched = []
        
        # Check for endpoints in OpenAPI but not in implementation
        for key, openapi_ep in openapi_map.items():
            if key not in impl_map:
                missing_in_impl.append(openapi_ep)
            else:
                # Check for mismatches
                impl_ep = impl_map[key]
                differences = self._compare_endpoints(openapi_ep, impl_ep)
                if differences:
                    mismatched.append((openapi_ep, impl_ep, differences))
        
        # Check for endpoints in implementation but not in OpenAPI
        for key, impl_ep in impl_map.items():
            if key not in openapi_map:
                missing_in_openapi.append(impl_ep)
        
        return GapAnalysisResult(
            missing_in_implementation=missing_in_impl,
            missing_in_openapi=missing_in_openapi,
            mismatched_endpoints=mismatched,
            total_openapi_endpoints=len(openapi_endpoints),
            total_implementation_endpoints=len(impl_endpoints),
            analysis_timestamp=datetime.now().isoformat()
        )
    
    def _create_endpoint_map(self, endpoints: List[EndpointInfo]) -> Dict[str, EndpointInfo]:
        """Create a map of endpoints keyed by method:path."""
        return {f"{ep.method}:{ep.path}": ep for ep in endpoints}
    
    def _compare_endpoints(self, openapi_ep: EndpointInfo, impl_ep: EndpointInfo) -> List[str]:
        """Compare two endpoints and return list of differences."""
        differences = []
        
        if openapi_ep.operation_id != impl_ep.operation_id:
            differences.append(f"operation_id: '{openapi_ep.operation_id}' vs '{impl_ep.operation_id}'")
        
        if openapi_ep.summary != impl_ep.summary:
            differences.append(f"summary: '{openapi_ep.summary}' vs '{impl_ep.summary}'")
        
        return differences


def print_summary(result: GapAnalysisResult):
    """Print summary to console."""
    print("\n" + "="*60)
    print("🎯 GAP ANALYSIS SUMMARY")
    print("="*60)
    print(f"📊 OpenAPI Endpoints: {result.total_openapi_endpoints}")
    print(f"📊 Implementation Endpoints: {result.total_implementation_endpoints}")
    print(f"🔴 Missing in Implementation: {len(result.missing_in_implementation)}")
    print(f"📝 Missing in OpenAPI: {len(result.missing_in_openapi)}")
    print(f"⚠️  Mismatched Endpoints: {len(result.mismatched_endpoints)}")
    
    if result.missing_in_implementation:
        print(f"\n🔴 CRITICAL: {len(result.missing_in_implementation)} endpoints need implementation:")
        for ep in result.missing_in_implementation:
            print(f"   - {ep.method} {ep.path} ({ep.operation_id or 'no operationId'})")
    
    if result.missing_in_openapi:
        print(f"\n📝 WARNING: {len(result.missing_in_openapi)} endpoints need documentation:")
        for ep in result.missing_in_openapi:
            print(f"   - {ep.method} {ep.path} ({ep.operation_id or 'no operationId'})")
    
    if result.mismatched_endpoints:
        print(f"\n⚠️  MISMATCHED: {len(result.mismatched_endpoints)} endpoints have differences:")
        for openapi_ep, impl_ep, differences in result.mismatched_endpoints:
            print(f"   - {openapi_ep.method} {openapi_ep.path}")
            for diff in differences:
                print(f"     • {diff}")
    
    print("="*60)


def generate_detailed_report(result: GapAnalysisResult) -> str:
    """Generate detailed markdown report."""
    timestamp = result.analysis_timestamp
    
    md = f"""# Gap Analysis Report - OpenAPI vs FastAPI Implementation

**Analysis Date**: {timestamp}

## 📊 Summary

| Metric | Count |
|--------|-------|
| OpenAPI Endpoints | {result.total_openapi_endpoints} |
| Implementation Endpoints | {result.total_implementation_endpoints} |
| Missing in Implementation | {len(result.missing_in_implementation)} |
| Missing in OpenAPI | {len(result.missing_in_openapi)} |
| Mismatched Endpoints | {len(result.mismatched_endpoints)} |

## 🔴 Missing in Implementation

These endpoints are documented in OpenAPI but not implemented:

"""
    
    if result.missing_in_implementation:
        for ep in result.missing_in_implementation:
            md += f"### `{ep.method} {ep.path}`\n"
            if ep.operation_id:
                md += f"- **Operation ID**: `{ep.operation_id}`\n"
            if ep.summary:
                md += f"- **Summary**: {ep.summary}\n"
            md += "\n"
    else:
        md += "*No missing endpoints found.*\n\n"
    
    md += """## 📝 Missing in OpenAPI

These endpoints are implemented but not documented in OpenAPI:

"""
    
    if result.missing_in_openapi:
        for ep in result.missing_in_openapi:
            md += f"### `{ep.method} {ep.path}`\n"
            if ep.operation_id:
                md += f"- **Operation ID**: `{ep.operation_id}`\n"
            if ep.summary:
                md += f"- **Summary**: {ep.summary}\n"
            md += "\n"
    else:
        md += "*No undocumented endpoints found.*\n\n"
    
    md += """## ⚠️ Mismatched Endpoints

These endpoints exist in both but have differences:

"""
    
    if result.mismatched_endpoints:
        for openapi_ep, impl_ep, differences in result.mismatched_endpoints:
            md += f"### `{openapi_ep.method} {openapi_ep.path}`\n"
            md += "**Differences:**\n"
            for diff in differences:
                md += f"- {diff}\n"
            md += "\n"
    else:
        md += "*No mismatched endpoints found.*\n\n"
    
    md += """## 🎯 Recommendations

### High Priority
1. **Implement missing endpoints** documented in OpenAPI
2. **Document missing endpoints** found in implementation
3. **Fix mismatched operation IDs** for consistency

### Medium Priority
1. **Standardize tags** across all endpoints
2. **Add missing summaries** to improve API documentation
3. **Review endpoint descriptions** for completeness

---
*Generated by Gap Analysis Tool*
"""
    
    return md


def main():
    """Main execution function."""
    print("🚀 Starting Gap Analysis - OpenAPI vs FastAPI Implementation")
    print("="*60)
    
    # Configuration
    openapi_file = "openapi.yaml"
    src_dir = "src"
    
    # Check if files exist
    if not os.path.exists(openapi_file):
        print(f"❌ Error: OpenAPI file '{openapi_file}' not found")
        sys.exit(1)
    
    if not os.path.exists(src_dir):
        print(f"❌ Error: Source directory '{src_dir}' not found")
        sys.exit(1)
    
    # Perform analysis
    analyzer = GapAnalyzer(openapi_file, src_dir)
    result = analyzer.analyze()
    
    # Print summary to console
    print_summary(result)
    
    # Generate detailed report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    md_file = f"GAP_ANALYSIS_REPORT_{timestamp}.md"
    
    md_content = generate_detailed_report(result)
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"\n✅ Gap analysis completed successfully!")
    print(f"📄 Detailed report saved to: {md_file}")


if __name__ == "__main__":
    main()