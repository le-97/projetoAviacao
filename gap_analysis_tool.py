#!/usr/bin/env python3
"""
Gap Analysis Tool - OpenAPI vs FastAPI Implementation Comparison

This script performs automated comparison between OpenAPI specification and
the actual FastAPI implementation to identify discrepancies, missing endpoints,
and schema mismatches.
"""

import os
import re
import json
import ast

# Importação condicional de yaml
try:
    import yaml
except ImportError:
    print("PyYAML não está instalado. Instale com: pip install PyYAML")
    yaml = None
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
    parameters: List[Dict[str, Any]] = None
    request_body: Optional[Dict[str, Any]] = None
    responses: Dict[str, Any] = None
    source: str = "unknown"  # 'openapi' or 'implementation'
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []
        if self.parameters is None:
            self.parameters = []
        if self.responses is None:
            self.responses = {}


@dataclass
class GapAnalysisResult:
    """Results of gap analysis between OpenAPI and implementation."""
    missing_in_implementation: List[EndpointInfo]
    missing_in_openapi: List[EndpointInfo]
    mismatched_endpoints: List[Tuple[EndpointInfo, EndpointInfo, List[str]]]
    total_openapi_endpoints: int
    total_implementation_endpoints: int
    analysis_timestamp: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "analysis_timestamp": self.analysis_timestamp,
            "summary": {
                "total_openapi_endpoints": self.total_openapi_endpoints,
                "total_implementation_endpoints": self.total_implementation_endpoints,
                "missing_in_implementation": len(self.missing_in_implementation),
                "missing_in_openapi": len(self.missing_in_openapi),
                "mismatched_endpoints": len(self.mismatched_endpoints)
            },
            "missing_in_implementation": [asdict(e) for e in self.missing_in_implementation],
            "missing_in_openapi": [asdict(e) for e in self.missing_in_openapi],
            "mismatched_endpoints": [
                {
                    "openapi": asdict(openapi_ep),
                    "implementation": asdict(impl_ep),
                    "differences": differences
                }
                for openapi_ep, impl_ep, differences in self.mismatched_endpoints
            ]
        }


class OpenAPIExtractor:
    """Extracts endpoint information from OpenAPI specification."""
    
    def __init__(self, openapi_file: str):
        self.openapi_file = openapi_file
        self.spec = self._load_openapi_spec()
    
    def _load_openapi_spec(self) -> Dict[str, Any]:
        """Load and parse OpenAPI specification."""
        try:
            with open(self.openapi_file, 'r', encoding='utf-8') as f:
                if self.openapi_file.endswith('.yaml') or self.openapi_file.endswith('.yml'):
                    if yaml is None:
                        print("Error: PyYAML is required to read YAML files. Install with: pip install PyYAML")
                        return {}
                    return yaml.safe_load(f)
                else:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading OpenAPI spec from {self.openapi_file}: {e}")
            return {}
    
    def extract_endpoints(self) -> List[EndpointInfo]:
        """Extract all endpoints from OpenAPI specification."""
        endpoints = []
        
        if 'paths' not in self.spec:
            return endpoints
        
        for path, path_info in self.spec['paths'].items():
            for method, operation in path_info.items():
                if method.lower() in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                    endpoint = EndpointInfo(
                        path=path,
                        method=method.upper(),
                        operation_id=operation.get('operationId'),
                        summary=operation.get('summary'),
                        description=operation.get('description'),
                        tags=operation.get('tags', []),
                        parameters=operation.get('parameters', []),
                        request_body=operation.get('requestBody'),
                        responses=operation.get('responses', {}),
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
            
            # Parse AST to find route decorators
            tree = ast.parse(content)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    endpoint_info = self._extract_endpoint_from_function(node, content, router_prefix)
                    if endpoint_info:
                        self.endpoints.append(endpoint_info)
                        
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    
    def _extract_endpoint_from_function(self, func_node: ast.FunctionDef, content: str, router_prefix: str) -> Optional[EndpointInfo]:
        """Extract endpoint information from a function with route decorator."""
        for decorator in func_node.decorator_list:
            endpoint_info = self._parse_route_decorator(decorator, func_node, content, router_prefix)
            if endpoint_info:
                return endpoint_info
        return None
    
    def _parse_route_decorator(self, decorator: ast.AST, func_node: ast.FunctionDef, content: str, router_prefix: str) -> Optional[EndpointInfo]:
        """Parse route decorator to extract endpoint information."""
        # Handle @router.get(), @app.get(), etc.
        if isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Attribute):
            method = decorator.func.attr.lower()
            if method in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                
                # Extract path from first argument
                path = ""
                if decorator.args and isinstance(decorator.args[0], ast.Constant):
                    path = decorator.args[0].value
                elif decorator.args and isinstance(decorator.args[0], ast.Str):  # Python < 3.8
                    path = decorator.args[0].s
                
                # Add router prefix
                full_path = router_prefix + path if router_prefix else path
                
                # Extract operation_id, summary, etc. from keyword arguments
                operation_id = None
                summary = None
                tags = []
                
                for keyword in decorator.keywords:
                    if keyword.arg == 'operation_id' and isinstance(keyword.value, ast.Constant):
                        operation_id = keyword.value.value
                    elif keyword.arg == 'summary' and isinstance(keyword.value, ast.Constant):
                        summary = keyword.value.value
                    elif keyword.arg == 'tags' and isinstance(keyword.value, ast.List):
                        tags = [elem.value for elem in keyword.value.elts if isinstance(elem, ast.Constant)]
                
                # Extract docstring as description
                description = None
                if (func_node.body and isinstance(func_node.body[0], ast.Expr) and 
                    isinstance(func_node.body[0].value, ast.Constant) and 
                    isinstance(func_node.body[0].value.value, str)):
                    description = func_node.body[0].value.value.strip()
                
                return EndpointInfo(
                    path=full_path,
                    method=method.upper(),
                    operation_id=operation_id,
                    summary=summary,
                    description=description,
                    tags=tags,
                    source='implementation'
                )
        
        return None


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
        
        # Compare tags (ignore order)
        openapi_tags = set(openapi_ep.tags or [])
        impl_tags = set(impl_ep.tags or [])
        if openapi_tags != impl_tags:
            differences.append(f"tags: {sorted(openapi_tags)} vs {sorted(impl_tags)}")
        
        return differences


class ReportGenerator:
    """Generates gap analysis reports in various formats."""
    
    def __init__(self, result: GapAnalysisResult):
        self.result = result
    
    def generate_json_report(self, output_file: str):
        """Generate JSON report."""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.result.to_dict(), f, indent=2, ensure_ascii=False)
        print(f"📄 JSON report saved to: {output_file}")
    
    def generate_markdown_report(self, output_file: str):
        """Generate Markdown report."""
        md_content = self._generate_markdown_content()
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"📄 Markdown report saved to: {output_file}")
    
    def _generate_markdown_content(self) -> str:
        """Generate markdown content for the report."""
        timestamp = self.result.analysis_timestamp
        
        md = f"""# Gap Analysis Report - OpenAPI vs FastAPI Implementation

**Analysis Date**: {timestamp}

## 📊 Summary

| Metric | Count |
|--------|-------|
| OpenAPI Endpoints | {self.result.total_openapi_endpoints} |
| Implementation Endpoints | {self.result.total_implementation_endpoints} |
| Missing in Implementation | {len(self.result.missing_in_implementation)} |
| Missing in OpenAPI | {len(self.result.missing_in_openapi)} |
| Mismatched Endpoints | {len(self.result.mismatched_endpoints)} |

## 🔴 Missing in Implementation

These endpoints are documented in OpenAPI but not implemented:

"""
        
        if self.result.missing_in_implementation:
            for ep in self.result.missing_in_implementation:
                md += f"### `{ep.method} {ep.path}`\n"
                if ep.operation_id:
                    md += f"- **Operation ID**: `{ep.operation_id}`\n"
                if ep.summary:
                    md += f"- **Summary**: {ep.summary}\n"
                if ep.tags:
                    md += f"- **Tags**: {', '.join(ep.tags)}\n"
                md += "\n"
        else:
            md += "*No missing endpoints found.*\n\n"
        
        md += """## 📝 Missing in OpenAPI

These endpoints are implemented but not documented in OpenAPI:

"""
        
        if self.result.missing_in_openapi:
            for ep in self.result.missing_in_openapi:
                md += f"### `{ep.method} {ep.path}`\n"
                if ep.operation_id:
                    md += f"- **Operation ID**: `{ep.operation_id}`\n"
                if ep.summary:
                    md += f"- **Summary**: {ep.summary}\n"
                if ep.description:
                    md += f"- **Description**: {ep.description}\n"
                md += "\n"
        else:
            md += "*No undocumented endpoints found.*\n\n"
        
        md += """## ⚠️ Mismatched Endpoints

These endpoints exist in both but have differences:

"""
        
        if self.result.mismatched_endpoints:
            for openapi_ep, impl_ep, differences in self.result.mismatched_endpoints:
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

### Low Priority
1. **Optimize endpoint organization** for better discoverability
2. **Consider deprecating unused endpoints**

---
*Generated by Gap Analysis Tool*
"""
        
        return md
    
    def print_summary(self):
        """Print summary to console."""
        print("\n" + "="*60)
        print("🎯 GAP ANALYSIS SUMMARY")
        print("="*60)
        print(f"📊 OpenAPI Endpoints: {self.result.total_openapi_endpoints}")
        print(f"📊 Implementation Endpoints: {self.result.total_implementation_endpoints}")
        print(f"🔴 Missing in Implementation: {len(self.result.missing_in_implementation)}")
        print(f"📝 Missing in OpenAPI: {len(self.result.missing_in_openapi)}")
        print(f"⚠️  Mismatched Endpoints: {len(self.result.mismatched_endpoints)}")
        
        if self.result.missing_in_implementation:
            print(f"\n🔴 CRITICAL: {len(self.result.missing_in_implementation)} endpoints need implementation:")
            for ep in self.result.missing_in_implementation[:5]:  # Show first 5
                print(f"   - {ep.method} {ep.path}")
            if len(self.result.missing_in_implementation) > 5:
                print(f"   ... and {len(self.result.missing_in_implementation) - 5} more")
        
        if self.result.missing_in_openapi:
            print(f"\n📝 WARNING: {len(self.result.missing_in_openapi)} endpoints need documentation:")
            for ep in self.result.missing_in_openapi[:5]:  # Show first 5
                print(f"   - {ep.method} {ep.path}")
            if len(self.result.missing_in_openapi) > 5:
                print(f"   ... and {len(self.result.missing_in_openapi) - 5} more")
        
        print("="*60)


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
    
    # Generate reports
    report_generator = ReportGenerator(result)
    
    # Print summary to console
    report_generator.print_summary()
    
    # Generate files
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_file = f"gap_analysis_{timestamp}.json"
    md_file = f"GAP_ANALYSIS_REPORT_{timestamp}.md"
    
    report_generator.generate_json_report(json_file)
    report_generator.generate_markdown_report(md_file)
    
    print(f"\n✅ Gap analysis completed successfully!")
    print(f"📄 Reports generated: {json_file}, {md_file}")


if __name__ == "__main__":
    main()