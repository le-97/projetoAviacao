#!/usr/bin/env python3
"""
Database Schema Analysis Tool
Analyzes the current database schema for optimization opportunities and best practices compliance.
"""

import asyncio
import sqlite3
import sys
import os
from typing import Dict, List, Any
from datetime import datetime

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.database import AsyncSessionLocal, create_tables
from src.models.db_models_sqlite import Base
from sqlalchemy import inspect, MetaData
from sqlalchemy.engine import create_engine


class DatabaseAnalyzer:
    """Comprehensive database schema analyzer."""
    
    def __init__(self, db_path: str = "projetoAviacao.db"):
        self.db_path = db_path
        self.issues = []
        self.recommendations = []
        
    def analyze_schema(self) -> Dict[str, Any]:
        """Perform comprehensive schema analysis."""
        print("🔍 Starting Database Schema Analysis...")
        
        # Connect to database
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            analysis = {
                "timestamp": datetime.now().isoformat(),
                "database": self.db_path,
                "tables": self._analyze_tables(cursor),
                "indexes": self._analyze_indexes(cursor),
                "relationships": self._analyze_relationships(cursor),
                "data_integrity": self._analyze_data_integrity(cursor),
                "performance": self._analyze_performance(cursor),
                "schema_consistency": self._analyze_schema_consistency(cursor),
                "issues": self.issues,
                "recommendations": self.recommendations
            }
            
            conn.close()
            return analysis
            
        except Exception as e:
            print(f"❌ Error analyzing database: {e}")
            return {"error": str(e)}
    
    def _analyze_tables(self, cursor) -> Dict[str, Any]:
        """Analyze table structure."""
        print("📋 Analyzing table structure...")
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        table_info = {}
        for table in tables:
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            row_count = cursor.fetchone()[0]
            
            table_info[table] = {
                "columns": len(columns),
                "rows": row_count,
                "schema": columns
            }
            
            # Check for common issues
            column_names = [col[1] for col in columns]
            
            # Check for missing timestamps
            if not any(name in ['created_at', 'updated_at'] for name in column_names):
                self.issues.append(f"Table '{table}' missing timestamp columns")
                self.recommendations.append(f"Add created_at and updated_at columns to '{table}' for audit trails")
            
            # Check for missing primary keys
            if not any(col[5] for col in columns):  # col[5] is pk flag
                self.issues.append(f"Table '{table}' missing primary key")
                self.recommendations.append(f"Add primary key to table '{table}'")
        
        return table_info
    
    def _analyze_indexes(self, cursor) -> Dict[str, Any]:
        """Analyze database indexes."""
        print("🔍 Analyzing database indexes...")
        
        # Get all indexes
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL")
        indexes = cursor.fetchall()
        
        index_info = {
            "total_indexes": len(indexes),
            "indexes": {}
        }
        
        for name, sql in indexes:
            index_info["indexes"][name] = sql
        
        # Check for missing indexes on foreign keys
        cursor.execute("""
            SELECT name FROM sqlite_master WHERE type='table'
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        for table in tables:
            cursor.execute(f"PRAGMA foreign_key_list({table})")
            foreign_keys = cursor.fetchall()
            
            for fk in foreign_keys:
                fk_column = fk[3]  # from column
                index_name = f"idx_{table}_{fk_column}"
                
                if not any(index_name in idx_name for idx_name in index_info["indexes"]):
                    self.issues.append(f"Missing index on foreign key '{fk_column}' in table '{table}'")
                    self.recommendations.append(f"Create index on '{table}.{fk_column}' for better join performance")
        
        return index_info
    
    def _analyze_relationships(self, cursor) -> Dict[str, Any]:
        """Analyze foreign key relationships."""
        print("🔗 Analyzing table relationships...")
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        relationships = {}
        for table in tables:
            cursor.execute(f"PRAGMA foreign_key_list({table})")
            foreign_keys = cursor.fetchall()
            
            if foreign_keys:
                relationships[table] = []
                for fk in foreign_keys:
                    relationships[table].append({
                        "column": fk[3],
                        "references_table": fk[2],
                        "references_column": fk[4]
                    })
        
        return relationships
    
    def _analyze_data_integrity(self, cursor) -> Dict[str, Any]:
        """Analyze data integrity constraints."""
        print("🛡️ Analyzing data integrity...")
        
        integrity_info = {
            "foreign_key_violations": [],
            "null_constraints": [],
            "unique_constraints": []
        }
        
        # Check foreign key integrity
        cursor.execute("PRAGMA foreign_key_check")
        fk_violations = cursor.fetchall()
        
        if fk_violations:
            integrity_info["foreign_key_violations"] = fk_violations
            self.issues.append(f"Found {len(fk_violations)} foreign key violations")
            
        return integrity_info
    
    def _analyze_performance(self, cursor) -> Dict[str, Any]:
        """Analyze performance-related aspects."""
        print("⚡ Analyzing performance characteristics...")
        
        # Get database size
        cursor.execute("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()")
        db_size = cursor.fetchone()[0]
        
        # Analyze table sizes
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        table_sizes = {}
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            row_count = cursor.fetchone()[0]
            table_sizes[table] = row_count
            
            # Check for large tables without proper indexing
            if row_count > 1000:
                cursor.execute(f"PRAGMA index_list({table})")
                indexes = cursor.fetchall()
                if len(indexes) < 2:  # Only has primary key
                    self.issues.append(f"Large table '{table}' ({row_count} rows) has insufficient indexing")
                    self.recommendations.append(f"Consider adding indexes to frequently queried columns in '{table}'")
        
        return {
            "database_size_bytes": db_size,
            "table_sizes": table_sizes
        }
    
    def _analyze_schema_consistency(self, cursor) -> Dict[str, Any]:
        """Analyze schema consistency and best practices."""
        print("📐 Analyzing schema consistency...")
        
        consistency_issues = []
        
        # Check naming conventions
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        for table in tables:
            # Check if table names follow snake_case convention
            if not table.islower() or '-' in table:
                consistency_issues.append(f"Table '{table}' doesn't follow snake_case naming convention")
            
            # Analyze column naming
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            
            for col in columns:
                col_name = col[1]
                if not col_name.islower() or '-' in col_name:
                    consistency_issues.append(f"Column '{col_name}' in table '{table}' doesn't follow snake_case naming")
        
        return {
            "naming_issues": consistency_issues
        }
    
    def generate_report(self, analysis: Dict[str, Any]) -> str:
        """Generate a comprehensive analysis report."""
        
        report = []
        report.append("=" * 80)
        report.append("DATABASE SCHEMA ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Analysis Date: {analysis['timestamp']}")
        report.append(f"Database: {analysis['database']}")
        report.append("")
        
        # Tables Summary
        report.append("📋 TABLES SUMMARY")
        report.append("-" * 40)
        if 'tables' in analysis:
            for table, info in analysis['tables'].items():
                report.append(f"• {table}: {info['columns']} columns, {info['rows']} rows")
        report.append("")
        
        # Indexes Summary
        report.append("🔍 INDEXES SUMMARY")
        report.append("-" * 40)
        if 'indexes' in analysis:
            report.append(f"Total Indexes: {analysis['indexes']['total_indexes']}")
            for name, sql in analysis['indexes']['indexes'].items():
                if not name.startswith('sqlite_'):
                    report.append(f"• {name}")
        report.append("")
        
        # Performance Summary
        report.append("⚡ PERFORMANCE SUMMARY")
        report.append("-" * 40)
        if 'performance' in analysis:
            db_size_mb = analysis['performance']['database_size_bytes'] / (1024 * 1024)
            report.append(f"Database Size: {db_size_mb:.2f} MB")
            
            # Largest tables
            sorted_tables = sorted(analysis['performance']['table_sizes'].items(), 
                                 key=lambda x: x[1], reverse=True)
            report.append("Largest Tables:")
            for table, size in sorted_tables[:5]:
                report.append(f"  • {table}: {size:,} rows")
        report.append("")
        
        # Issues Summary
        report.append("❌ ISSUES IDENTIFIED")
        report.append("-" * 40)
        if analysis['issues']:
            for i, issue in enumerate(analysis['issues'], 1):
                report.append(f"{i:2d}. {issue}")
        else:
            report.append("✅ No critical issues found!")
        report.append("")
        
        # Recommendations Summary
        report.append("💡 RECOMMENDATIONS")
        report.append("-" * 40)
        if analysis['recommendations']:
            for i, rec in enumerate(analysis['recommendations'], 1):
                report.append(f"{i:2d}. {rec}")
        else:
            report.append("✅ Schema follows best practices!")
        
        report.append("")
        report.append("=" * 80)
        
        return "\n".join(report)


async def main():
    """Main analysis function."""
    analyzer = DatabaseAnalyzer()
    
    # Ensure tables exist
    await create_tables()
    
    # Run analysis
    analysis = analyzer.analyze_schema()
    
    # Generate and print report
    report = analyzer.generate_report(analysis)
    print(report)
    
    # Save report to file
    report_file = f"database_analysis_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"\n📄 Report saved to: {report_file}")
    
    return analysis


if __name__ == "__main__":
    analysis_result = asyncio.run(main())