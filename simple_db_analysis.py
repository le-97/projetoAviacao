#!/usr/bin/env python3
"""
Simple Database Schema Analysis
Analyzes the current database schema using basic SQLite tools.
"""

import sqlite3
import os
from datetime import datetime


def analyze_database(db_path="projetoAviacao.db"):
    """Analyze database schema and generate report."""
    
    print("🔍 Starting Database Schema Analysis...")
    
    if not os.path.exists(db_path):
        print(f"❌ Database file '{db_path}' not found!")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [row[0] for row in cursor.fetchall()]
        
        report = []
        report.append("=" * 80)
        report.append("DATABASE SCHEMA ANALYSIS REPORT")
        report.append("=" * 80)
        report.append(f"Analysis Date: {datetime.now().isoformat()}")
        report.append(f"Database: {db_path}")
        report.append(f"Total Tables: {len(tables)}")
        report.append("")
        
        issues = []
        recommendations = []
        
        # Analyze each table
        for table in tables:
            report.append(f"📋 TABLE: {table}")
            report.append("-" * 40)
            
            # Get table info
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            row_count = cursor.fetchone()[0]
            
            report.append(f"Columns: {len(columns)}")
            report.append(f"Rows: {row_count:,}")
            
            # Check column details
            has_id = False
            has_created_at = False
            has_updated_at = False
            
            report.append("Columns:")
            for col in columns:
                col_id, name, type_, not_null, default, pk = col
                pk_marker = " (PK)" if pk else ""
                null_marker = " NOT NULL" if not_null else ""
                report.append(f"  • {name}: {type_}{pk_marker}{null_marker}")
                
                if name == 'id':
                    has_id = True
                elif name == 'created_at':
                    has_created_at = True
                elif name == 'updated_at':
                    has_updated_at = True
            
            # Check for issues
            if not has_id:
                issues.append(f"Table '{table}' missing 'id' primary key")
            if not has_created_at:
                issues.append(f"Table '{table}' missing 'created_at' timestamp")
            if not has_updated_at:
                issues.append(f"Table '{table}' missing 'updated_at' timestamp")
            
            # Check indexes
            cursor.execute(f"PRAGMA index_list({table})")
            indexes = cursor.fetchall()
            
            if indexes:
                report.append(f"Indexes: {len(indexes)}")
                for index in indexes:
                    report.append(f"  • {index[1]}")
            else:
                report.append("Indexes: None")
                if row_count > 100:
                    recommendations.append(f"Consider adding indexes to table '{table}' with {row_count:,} rows")
            
            # Check foreign keys
            cursor.execute(f"PRAGMA foreign_key_list({table})")
            foreign_keys = cursor.fetchall()
            
            if foreign_keys:
                report.append(f"Foreign Keys: {len(foreign_keys)}")
                for fk in foreign_keys:
                    report.append(f"  • {fk[3]} → {fk[2]}.{fk[4]}")
            
            report.append("")
        
        # Overall database info
        cursor.execute("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()")
        db_size = cursor.fetchone()[0]
        db_size_mb = db_size / (1024 * 1024)
        
        report.append("📊 DATABASE STATISTICS")
        report.append("-" * 40)
        report.append(f"Database Size: {db_size_mb:.2f} MB")
        
        # Get table sizes
        table_sizes = []
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            table_sizes.append((table, count))
        
        table_sizes.sort(key=lambda x: x[1], reverse=True)
        report.append("Table Sizes (by row count):")
        for table, count in table_sizes:
            report.append(f"  • {table}: {count:,} rows")
        
        report.append("")
        
        # Issues section
        report.append("❌ ISSUES IDENTIFIED")
        report.append("-" * 40)
        if issues:
            for i, issue in enumerate(issues, 1):
                report.append(f"{i:2d}. {issue}")
        else:
            report.append("✅ No critical issues found!")
        
        report.append("")
        
        # Recommendations section
        report.append("💡 RECOMMENDATIONS")
        report.append("-" * 40)
        if recommendations:
            for i, rec in enumerate(recommendations, 1):
                report.append(f"{i:2d}. {rec}")
        else:
            report.append("✅ Schema follows best practices!")
        
        # Additional best practice recommendations
        additional_recs = [
            "Consider implementing database connection pooling for better performance",
            "Add database backup and recovery procedures",
            "Implement proper error handling for database operations",
            "Consider using database migrations for schema changes",
            "Add database monitoring and logging for production",
            "Review and optimize slow queries using EXPLAIN QUERY PLAN",
            "Consider implementing read replicas for better read performance",
            "Add proper indexing strategy for frequently queried columns"
        ]
        
        report.append("")
        report.append("🚀 ADDITIONAL BEST PRACTICES")
        report.append("-" * 40)
        for i, rec in enumerate(additional_recs, 1):
            report.append(f"{i:2d}. {rec}")
        
        report.append("")
        report.append("=" * 80)
        
        # Print and save report
        report_text = "\n".join(report)
        print(report_text)
        
        # Save to file
        report_file = f"database_analysis_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report_text)
        
        print(f"\n📄 Report saved to: {report_file}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error analyzing database: {e}")


if __name__ == "__main__":
    analyze_database()