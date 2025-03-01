from pydantic import BaseModel, model_validator, field_validator
from typing import Optional

class AnalysisRequest(BaseModel):
    url: Optional[str] = None
    keyword: Optional[str] = None
    hashtag: Optional[str] = None
    
    @field_validator('*', mode='before')
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v
    
    @field_validator('url')
    def validate_url(cls, v):
        if v is None:
            return None
        if not v.startswith(('http://', 'https://')):
            v = 'https://' + v
        return v
    
    @model_validator(mode='after')
    def validate_at_least_one(self):
        if not any([self.url, self.keyword, self.hashtag]):
            raise ValueError("At least one of url, keyword, or hashtag must be provided")
        return self