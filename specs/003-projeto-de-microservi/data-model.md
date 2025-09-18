# Data Model for Compliance Microservice

## Entities

### Aircraft
*   **Represents**: An Embraer aircraft model.
*   **Attributes**:
    *   `model_name`: string (e.g., "E190", "E195")

### Regulation
*   **Represents**: A regulatory rule from an aviation authority.
*   **Attributes**:
    *   `authority`: string (e.g., "ANAC", "FAA", "EASA")
    *   `description`: string
    *   `applicability`: list of strings (e.g., ["E190", "E195"])

### ComplianceReport
*   **Represents**: The output of a compliance check.
*   **Attributes**:
    *   `aircraft_model`: string
    *   `country`: string
    *   `status`: string (e.g., "OK", "PENDING", "NON-COMPLIANT")
    *   `pending_requirements`: list of strings
