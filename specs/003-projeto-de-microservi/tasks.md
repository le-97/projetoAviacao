# Tasks for Compliance Microservice

## Feature: Projeto de Microserviço: Validação de Conformidade de Aeronaves Embraer

### Setup Tasks

*   **T001**: Initialize the project structure with `src` and `tests` directories.
*   **T002**: Create a `requirements.txt` file with the following dependencies:
    ```
    fastapi
    pydantic
    uvicorn
    pytest
    httpx
    ```

### Test Tasks [P]

*   **T003**: [P] Create a contract test in `tests/contract/test_compliance_api.py` for the `/check-compliance` endpoint, asserting the request and response schemas defined in `contracts/compliance.json`.
*   **T004**: [P] Create an integration test in `tests/integration/test_compliance_flow.py` that follows the primary user story from the spec.

### Core Tasks

*   **T005**: [P] Create the Pydantic models for `Aircraft`, `Regulation`, and `ComplianceReport` in `src/models/compliance.py` based on `data-model.md`.
*   **T006**: Create the compliance check service in `src/services/compliance_service.py`. This service will contain the core logic for validating aircraft compliance.
*   **T007**: Create the FastAPI endpoint in `src/api/compliance.py` that uses the `compliance_service`.
*   **T008**: Create the main application file `src/main.py` to initialize the FastAPI app and include the compliance API router.

### Integration Tasks

*   **T009**: Implement the logic in `src/services/compliance_service.py` to fetch regulation data. For now, this can be a mock implementation that returns hardcoded data.

### Polish Tasks [P]

*   **T010**: [P] Add unit tests for the `compliance_service` in `tests/unit/test_compliance_service.py`.
*   **T011**: [P] Add docstrings to all public functions and classes.

## Parallel Execution Examples

```bash
# Run all parallelizable tests
gemini --exec-task T003 &
gemini --exec-task T004 &

# Run all parallelizable core tasks
gemini --exec-task T005 &

# Run all parallelizable polish tasks
gemini --exec-task T010 &
gemini --exec-task T011 &
```
