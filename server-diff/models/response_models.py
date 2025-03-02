from pydantic import BaseModel
from typing import List, Dict, Any

class ArticleSource(BaseModel):
    source_name: str
    source_url: str
    reliability_score: int

class WordFrequency(BaseModel):
    word: str
    count: int

class RelatedArticle(BaseModel):
    source_name: str
    source_url: str

class Article(BaseModel):
    article_id: str
    title: str
    hyperlink: str
    content: str
    word_cloud: List[WordFrequency]
    related_articles: List[RelatedArticle]

class SourceReliability(BaseModel):
    source_score: int
    source_name: str
    source_url: str
    country: str

class LanguageScore(BaseModel):
    language_score: int
    article_text: str
    propaganda_language_detected: str
    topic: str
    propaganda_techniques: Dict[str, int]
    time_series_data: List[Dict[str, Any]]

class CoordinationScore(BaseModel):
    coordination_score: int
    statistics: Dict[str, int]
    tweet_timeline: List[Dict[str, Any]]
    top_hashtags: List[Dict[str, Any]]
    top_users: List[Dict[str, Any]]
    top_languages: List[Dict[str, Any]]
    top_annotations: List[Dict[str, Any]]
    network_data: Dict[str, Any]

class BotActivity(BaseModel):
    bot_score: int
    sharing_time_distribution: List[Dict[str, Any]]
    suspicious_accounts: List[Dict[str, Any]]
    fast_sharing_communities: Dict[str, Any]

class ScoreMetric(BaseModel):
    source_score: int
    language_score: int
    coordination_score: int
    bot_activity_score: int
    average_score: int

class DashboardData(BaseModel):
    article: Article
    source_reliability: SourceReliability
    language_score: LanguageScore
    coordination_score: CoordinationScore
    bot_activity: BotActivity
    score_metric: ScoreMetric

class TrendingTopic(BaseModel):
    id: int
    title: str
    description: str
    engagement: int
    source_count: int
    recent_urls: List[str]