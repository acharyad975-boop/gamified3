"""JSON Schemas for AI Engine Student Profile Output."""

STUDENT_PROFILE_JSON_SCHEMA = {
    "type": "object",
    "required": [
        "student_summary",
        "strengths",
        "improvement_areas",
        "effective_learning_formats",
        "recommended_starting_subject",
        "recommended_difficulty",
        "recommended_path",
        "recommendations"
    ],
    "properties": {
        "student_summary": {"type": "string"},
        "strengths": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["subject", "score", "reason"],
                "properties": {
                    "subject": {"type": "string"},
                    "score": {"type": "number"},
                    "reason": {"type": "string"}
                }
            }
        },
        "improvement_areas": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["subject", "score", "recommendation"],
                "properties": {
                    "subject": {"type": "string"},
                    "score": {"type": "number"},
                    "recommendation": {"type": "string"}
                }
            }
        },
        "effective_learning_formats": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["format", "effectiveness_score"],
                "properties": {
                    "format": {"type": "string"},
                    "effectiveness_score": {"type": "number"}
                }
            }
        },
        "recommended_starting_subject": {"type": "string"},
        "recommended_difficulty": {"type": "string"},
        "recommended_path": {
            "type": "array",
            "items": {"type": "string"}
        },
        "recommendations": {
            "type": "array",
            "items": {"type": "string"}
        }
    }
}
