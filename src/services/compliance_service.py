import json
from src.models.compliance import ComplianceReport

class ComplianceService:
    """Service for checking aircraft compliance."""

    def __init__(self):
        with open("src/data/regulations.json") as f:
            self.regulations = json.load(f)
        self.authority_map = {
            "USA": "FAA",
            "BRAZIL": "ANAC",
            "EUROPE": "EASA",
        }

    def check_compliance(self, model: str, country: str) -> ComplianceReport:
        """Checks the compliance of an aircraft model in a given country.

        Args:
            model: The aircraft model.
            country: The country to check compliance in.

        Returns:
            A compliance report.
        """
        pending_requirements = []
        status = "OK"
        authority = self.authority_map.get(country.upper())

        if authority:
            for reg in self.regulations:
                if authority == reg["authority"] and model in reg["applicability"]:
                    if "AD-" in reg["description"]:
                        pending_requirements.append(reg["description"])
                        status = "PENDING"

        return ComplianceReport(
            aircraft_model=model,
            country=country,
            status=status,
            pending_requirements=pending_requirements,
        )
