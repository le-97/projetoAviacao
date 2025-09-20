"""
Comprehensive unit tests for ComplianceService.

This module provides improved test coverage for the ComplianceService,
including async function testing, edge cases, and cache scenarios.
"""

import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from src.services.compliance_service import ComplianceService, ValidationError
from src.models.compliance import ComplianceReport
from src.services.cache_service import cache_service


class TestComplianceServiceValidation:
    """Test input validation functionality."""

    def setup_method(self):
        """Set up test fixtures."""
        self.service = ComplianceService()

    def test_validate_input_valid_model_and_country(self):
        """Test validation with valid model and country."""
        # Should not raise any exception
        self.service.validate_input("E190", "USA")
        self.service.validate_input("E195", "BRAZIL")
        self.service.validate_input("e190", "europe")  # Test case insensitive

    def test_validate_input_empty_model(self):
        """Test validation with empty model."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("", "USA")
        
        assert exc_info.value.error_type == "MISSING_MODEL"
        assert "Aircraft model is required" in exc_info.value.message

    def test_validate_input_none_model(self):
        """Test validation with None model."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input(None, "USA")
        
        assert exc_info.value.error_type == "MISSING_MODEL"

    def test_validate_input_whitespace_model(self):
        """Test validation with whitespace-only model."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("   ", "USA")
        
        assert exc_info.value.error_type == "MISSING_MODEL"

    def test_validate_input_empty_country(self):
        """Test validation with empty country."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("E190", "")
        
        assert exc_info.value.error_type == "MISSING_COUNTRY"
        assert "Country is required" in exc_info.value.message

    def test_validate_input_none_country(self):
        """Test validation with None country."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("E190", None)
        
        assert exc_info.value.error_type == "MISSING_COUNTRY"

    def test_validate_input_whitespace_country(self):
        """Test validation with whitespace-only country."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("E190", "   ")
        
        assert exc_info.value.error_type == "MISSING_COUNTRY"

    def test_validate_input_unsupported_model(self):
        """Test validation with unsupported model."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("A320", "USA")
        
        assert exc_info.value.error_type == "UNSUPPORTED_MODEL"
        assert "A320" in exc_info.value.message
        assert "E190" in exc_info.value.message

    def test_validate_input_unsupported_country(self):
        """Test validation with unsupported country."""
        with pytest.raises(ValidationError) as exc_info:
            self.service.validate_input("E190", "JAPAN")
        
        assert exc_info.value.error_type == "UNSUPPORTED_COUNTRY"
        assert "JAPAN" in exc_info.value.message
        assert "USA" in exc_info.value.message

    def test_validate_input_case_insensitive(self):
        """Test that validation is case insensitive."""
        # These should all pass
        self.service.validate_input("e190", "usa")
        self.service.validate_input("E190", "usa")
        self.service.validate_input("e190", "USA")
        self.service.validate_input("E195", "brazil")
        self.service.validate_input("e195", "EUROPE")


class TestComplianceServiceAsync:
    """Test async compliance checking functionality."""

    def setup_method(self):
        """Set up test fixtures."""
        self.service = ComplianceService()

    @pytest.mark.asyncio
    async def test_check_compliance_usa_with_pending(self):
        """Test compliance check for USA with pending requirements."""
        result = await self.service.check_compliance("E190", "USA")
        
        assert isinstance(result, ComplianceReport)
        assert result.aircraft_model == "E190"
        assert result.country == "USA"
        assert result.status == "PENDING"
        assert len(result.pending_requirements) > 0
        assert any("AD-" in req for req in result.pending_requirements)

    @pytest.mark.asyncio
    async def test_check_compliance_brazil_ok(self):
        """Test compliance check for Brazil with OK status."""
        result = await self.service.check_compliance("E190", "BRAZIL")
        
        assert isinstance(result, ComplianceReport)
        assert result.aircraft_model == "E190"
        assert result.country == "BRAZIL"
        assert result.status == "OK"
        assert len(result.pending_requirements) == 0

    @pytest.mark.asyncio
    async def test_check_compliance_europe_ok(self):
        """Test compliance check for Europe with OK status."""
        result = await self.service.check_compliance("E195", "EUROPE")
        
        assert isinstance(result, ComplianceReport)
        assert result.aircraft_model == "E195"
        assert result.country == "EUROPE"
        assert result.status == "OK"
        assert len(result.pending_requirements) == 0

    @pytest.mark.asyncio
    async def test_check_compliance_case_insensitive(self):
        """Test that compliance check is case insensitive."""
        result1 = await self.service.check_compliance("e190", "usa")
        result2 = await self.service.check_compliance("E190", "USA")
        
        assert result1.aircraft_model == "e190"
        assert result2.aircraft_model == "E190"
        assert result1.status == result2.status
        assert len(result1.pending_requirements) == len(result2.pending_requirements)

    @pytest.mark.asyncio
    async def test_check_compliance_invalid_model(self):
        """Test compliance check with invalid model raises ValidationError."""
        with pytest.raises(ValidationError) as exc_info:
            await self.service.check_compliance("INVALID", "USA")
        
        assert exc_info.value.error_type == "UNSUPPORTED_MODEL"

    @pytest.mark.asyncio
    async def test_check_compliance_invalid_country(self):
        """Test compliance check with invalid country raises ValidationError."""
        with pytest.raises(ValidationError) as exc_info:
            await self.service.check_compliance("E190", "INVALID")
        
        assert exc_info.value.error_type == "UNSUPPORTED_COUNTRY"

    @pytest.mark.asyncio
    async def test_check_compliance_empty_model(self):
        """Test compliance check with empty model raises ValidationError."""
        with pytest.raises(ValidationError) as exc_info:
            await self.service.check_compliance("", "USA")
        
        assert exc_info.value.error_type == "MISSING_MODEL"

    @pytest.mark.asyncio
    async def test_check_compliance_empty_country(self):
        """Test compliance check with empty country raises ValidationError."""
        with pytest.raises(ValidationError) as exc_info:
            await self.service.check_compliance("E190", "")
        
        assert exc_info.value.error_type == "MISSING_COUNTRY"


class TestComplianceServiceCaching:
    """Test caching functionality in ComplianceService."""

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
        with patch.object(cache_service, 'is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch.object(cache_service, 'set_compliance_result', new_callable=AsyncMock) as mock_set, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.return_value = None  # Cache miss
            
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            mock_get.assert_called_once_with("E190", "USA")
            mock_set.assert_called_once()

    @pytest.mark.asyncio
    async def test_check_compliance_cache_disabled(self):
        """Test compliance check with cache disabled."""
        with patch('src.config.settings.cache_enabled', False), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get:
            
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            mock_get.assert_not_called()

    @pytest.mark.asyncio
    async def test_check_compliance_cache_error_on_get(self):
        """Test compliance check handles cache get errors gracefully."""
        with patch.object(cache_service, 'is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.side_effect = Exception("Cache connection error")
            
            # Should not raise exception, should fall back to normal processing
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"

    @pytest.mark.asyncio
    async def test_check_compliance_cache_error_on_set(self):
        """Test compliance check handles cache set errors gracefully."""
        with patch.object(cache_service, 'is_connected', True), \
             patch.object(cache_service, 'get_compliance_result', new_callable=AsyncMock) as mock_get, \
             patch.object(cache_service, 'set_compliance_result', new_callable=AsyncMock) as mock_set, \
             patch('src.config.settings.cache_enabled', True):
            
            mock_get.return_value = None  # Cache miss
            mock_set.side_effect = Exception("Cache store error")
            
            # Should not raise exception, should complete normally
            result = await self.service.check_compliance("E190", "USA")
            
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == "E190"


class TestComplianceServiceProperties:
    """Test service properties and initialization."""

    def setup_method(self):
        """Set up test fixtures."""
        self.service = ComplianceService()

    def test_initialization(self):
        """Test service initialization."""
        assert self.service.authority_map == {
            "USA": "FAA",
            "BRAZIL": "ANAC", 
            "EUROPE": "EASA",
        }
        assert self.service.supported_models == ["E190", "E195"]
        assert self.service.supported_countries == ["USA", "BRAZIL", "EUROPE"]

    def test_regulations_lazy_loading(self):
        """Test that regulations are loaded lazily."""
        # First access should load from file
        with patch('builtins.open', create=True) as mock_open:
            mock_file = MagicMock()
            mock_file.__enter__.return_value = mock_file
            mock_open.return_value = mock_file
            
            with patch('json.load') as mock_json:
                mock_json.return_value = [{"test": "data"}]
                
                regulations = self.service.regulations
                
                assert regulations == [{"test": "data"}]
                mock_open.assert_called_once_with("src/data/regulations.json")
                mock_json.assert_called_once()

    def test_regulations_cached_after_first_load(self):
        """Test that regulations are cached after first load."""
        # Set regulations manually to test caching
        self.service._regulations = [{"cached": "data"}]
        
        with patch('builtins.open', create=True) as mock_open:
            regulations = self.service.regulations
            
            assert regulations == [{"cached": "data"}]
            mock_open.assert_not_called()


class TestValidationErrorException:
    """Test ValidationError exception class."""

    def test_validation_error_with_message_only(self):
        """Test ValidationError with just a message."""
        error = ValidationError("Test message")
        
        assert error.message == "Test message"
        assert error.error_type == "VALIDATION_ERROR"
        assert str(error) == "Test message"

    def test_validation_error_with_custom_type(self):
        """Test ValidationError with custom error type."""
        error = ValidationError("Test message", "CUSTOM_ERROR")
        
        assert error.message == "Test message"
        assert error.error_type == "CUSTOM_ERROR"

    def test_validation_error_inheritance(self):
        """Test that ValidationError properly inherits from Exception."""
        error = ValidationError("Test")
        
        assert isinstance(error, Exception)
        assert isinstance(error, ValidationError)


class TestComplianceServiceEdgeCases:
    """Test edge cases and boundary conditions."""

    def setup_method(self):
        """Set up test fixtures."""
        self.service = ComplianceService()

    @pytest.mark.asyncio
    async def test_all_supported_model_country_combinations(self):
        """Test all valid combinations of models and countries."""
        for model in self.service.supported_models:
            for country in self.service.supported_countries:
                result = await self.service.check_compliance(model, country)
                
                assert isinstance(result, ComplianceReport)
                assert result.aircraft_model == model
                assert result.country == country
                assert result.status in ["OK", "PENDING"]
                assert isinstance(result.pending_requirements, list)

    @pytest.mark.asyncio
    async def test_model_case_variations(self):
        """Test various case combinations for models."""
        variations = ["e190", "E190", "E190".lower(), "E190".upper()]
        
        for model in variations:
            result = await self.service.check_compliance(model, "USA")
            assert isinstance(result, ComplianceReport)
            assert result.aircraft_model == model  # Should preserve original case

    @pytest.mark.asyncio
    async def test_country_case_variations(self):
        """Test various case combinations for countries."""
        variations = ["usa", "USA", "Usa", "UsA"]
        
        for country in variations:
            result = await self.service.check_compliance("E190", country)
            assert isinstance(result, ComplianceReport)
            assert result.country == country  # Should preserve original case

    def test_authority_mapping_completeness(self):
        """Test that all supported countries have authority mappings."""
        for country in self.service.supported_countries:
            assert country in self.service.authority_map
            assert self.service.authority_map[country] is not None
            assert len(self.service.authority_map[country]) > 0

    def test_supported_data_consistency(self):
        """Test consistency between supported models/countries and other data."""
        # Ensure supported lists are not empty
        assert len(self.service.supported_models) > 0
        assert len(self.service.supported_countries) > 0
        
        # Ensure authority map covers all countries
        assert set(self.service.supported_countries) == set(self.service.authority_map.keys())