"""
Fixed comprehensive tests for ComplianceService with corrected cache service mocking.

This module provides improved tests for the ComplianceService with proper
mocking of the cache service's private attributes.
"""

import pytest
from unittest.mock import patch, AsyncMock
from src.services.compliance_service import ComplianceService, ValidationError
from src.models.compliance import ComplianceReport
from src.services.cache_service import cache_service


class TestComplianceServiceFixed:
    """Fixed test cases for ComplianceService."""

    def setup_method(self):
        """Set up test fixtures."""
        self.service = ComplianceService()

    @pytest.mark.asyncio
    async def test_check_compliance_cache_hit(self):
        """Test compliance check with cache hit."""
        cached_result = {
            "aircraft_model": "E190",
            "country": "USA",
            "status": "PENDING",
            "pending_requirements": ["AD-2025-12: Wing inspection required"]
        }
        
        with patch.object(cache_service, '_is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.return_value = cached_result
            
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"
            assert result.country == "USA"
            assert result.status == "PENDING"
            mock_get.assert_called_once_with("E190", "USA")

    @pytest.mark.asyncio
    async def test_check_compliance_cache_miss(self):
        """Test compliance check with cache miss."""
        with patch.object(cache_service, '_is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch.object(cache_service, 'set_compliance_result', new_callable=AsyncMock) as mock_set, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.return_value = None  # Cache miss
            
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"
            assert result.country == "USA"
            mock_get.assert_called_once_with("E190", "USA")
            mock_set.assert_called_once()

    @pytest.mark.asyncio
    async def test_check_compliance_cache_disabled(self):
        """Test compliance check with cache disabled."""
        with patch.object(cache_service, '_is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch('src.config.settings.cache_enabled', False):
            
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            mock_get.assert_not_called()

    @pytest.mark.asyncio
    async def test_check_compliance_cache_error_on_get(self):
        """Test compliance check when cache get throws error."""
        with patch.object(cache_service, '_is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.side_effect = Exception("Redis connection error")
            
            # Should still return valid result without cache
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"
            assert result.country == "USA"

    @pytest.mark.asyncio
    async def test_check_compliance_cache_error_on_set(self):
        """Test compliance check when cache set throws error."""
        with patch.object(cache_service, '_is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch.object(cache_service, 'set_compliance_result', new_callable=AsyncMock) as mock_set, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.return_value = None  # Cache miss
            mock_set.side_effect = Exception("Redis write error")
            
            # Should still return valid result even if cache set fails
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"
            assert result.country == "USA"

    @pytest.mark.asyncio
    async def test_validate_input_valid_model_and_country(self):
        """Test validation with valid model and country."""
        # This should not raise an exception
        self.service.validate_input("E190", "USA")

    @pytest.mark.asyncio
    async def test_validate_input_invalid_model(self):
        """Test validation with invalid model."""
        with pytest.raises(ValidationError, match="Aircraft model 'INVALID' is not supported"):
            self.service.validate_input("INVALID", "USA")

    @pytest.mark.asyncio
    async def test_validate_input_invalid_country(self):
        """Test validation with invalid country."""
        with pytest.raises(ValidationError, match="Country 'INVALID' is not supported"):
            self.service.validate_input("E190", "INVALID")

    @pytest.mark.asyncio
    async def test_validate_input_empty_model(self):
        """Test validation with empty model."""
        with pytest.raises(ValidationError, match="Aircraft model is required"):
            self.service.validate_input("", "USA")

    @pytest.mark.asyncio
    async def test_validate_input_empty_country(self):
        """Test validation with empty country."""
        with pytest.raises(ValidationError, match="Country is required"):
            self.service.validate_input("E190", "")

    @pytest.mark.asyncio
    async def test_check_compliance_usa_pending(self):
        """Test compliance check for USA with pending status."""
        result = await self.service.check_compliance("E190", "USA")
        
        assert isinstance(result, ComplianceReport)
        assert result.aircraft_model == "E190"
        assert result.country == "USA"
        assert result.status == "PENDING"
        assert "AD-2025-12" in str(result.pending_requirements)

    @pytest.mark.asyncio
    async def test_check_compliance_brazil_ok(self):
        """Test compliance check for Brazil with OK status."""
        result = await self.service.check_compliance("E190", "Brazil")
        
        assert isinstance(result, ComplianceReport)
        assert result.aircraft_model == "E190"
        assert result.country == "Brazil"
        assert result.status == "OK"

    @pytest.mark.asyncio
    async def test_check_compliance_case_insensitive(self):
        """Test that compliance check accepts case insensitive inputs."""
        result1 = await self.service.check_compliance("e190", "usa")
        result2 = await self.service.check_compliance("E190", "USA")
        
        # Both should succeed and return ComplianceReport
        assert isinstance(result1, ComplianceReport)
        assert isinstance(result2, ComplianceReport)
        assert result1.status == result2.status  # Same compliance status