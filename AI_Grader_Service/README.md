1. Create virtualenv and install:
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt

2. Run server:
   uvicorn app.main:app --reload --port 8000

3. Test with Postman / curl:
   POST http://localhost:8000/grade
   Body (JSON): see sample_requests/sample_grade_request.json

Notes:

- The service performs deterministic grading locally and returns a structured JSON report.
- There's an optional Gemini integration (gemini_client.py). To enable, set environment variables and
  uncomment the call in main.py. The gemini_client is provided as a commented example and must be adapted
  to your Gemini / Vertex AI setup and credentials.
