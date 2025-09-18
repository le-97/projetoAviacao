from src.models.compliance import ComplianceReport

class ComplianceService:
    """Service for checking aircraft compliance."""
    def check_compliance(self, model: str, country: str) -> ComplianceReport:
        """Checks the compliance of an aircraft model in a given country.

        Args:
            model: The aircraft model.
            country: The country to check compliance in.

        Returns:
            A compliance report.
        """
        # Mock implementation for now
        if model == "E190" and country == "USA":
            return ComplianceReport(
                aircraft_model="E190",
                country="USA",
                status="PENDING",
                pending_requirements=["AD-2025-12: Wing inspection required"],
            )
        else:
            return ComplianceReport(
                aircraft_model=model,
                country=country,
                status="OK",
                pending_requirements=[],
            )
