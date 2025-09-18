# Research for Compliance Microservice

## Technical Stack

*   **Language/Version**: Python 3.11 was chosen for its strong ecosystem for web development and data analysis.
*   **Primary Dependencies**:
    *   **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints.
    *   **pydantic**: Data validation and settings management using python type annotations.
    *   **httpx**: A fully featured HTTP client for Python 3, which provides sync and async APIs, and support for both HTTP/1.1 and HTTP/2.
*   **Testing**: `pytest` will be used for its simplicity and powerful features.

## Unresolved Questions

*   **Performance Goals**: A target response time of < 500ms for p95 is a reasonable starting point.
*   **Constraints**: We need to investigate the rate limits of the external APIs (ANAC, FAA, EASA) to understand potential bottlenecks.
*   **Scale/Scope**: The initial scope is to support a low number of concurrent requests, but the architecture should be scalable.
*   **Regulation Updates**: A mechanism to periodically update the local database of regulations is needed. This could be a scheduled job that scrapes the official sources.
