# Quickstart for Compliance Microservice

## Running the service

1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
2.  Run the service:
    ```bash
    uvicorn src.main:app --reload
    ```

## Running tests

1.  Run the tests:
    ```bash
    pytest
    ```

## Example usage

```bash
curl "http://127.0.0.1:8000/check-compliance?model=E190&country=USA"
```
