# utils/data_generators.py
import random
from datetime import datetime, timedelta
from models.response_models import (
    Article, ArticleSource, RelatedArticle, SourceReliability,
    LanguageScore, CoordinationScore, BotActivity, ScoreMetric,
    DashboardData, TrendingTopic, WordFrequency
)

def generate_article_source():
    return ArticleSource(
        source_name=f"{random.choice(['Daily', 'Global', 'Truth'])} News",
        source_url=f"https://{random.choice(['daily', 'global', 'truth'])}news.com/article/{random.randint(1000,9999)}",
        reliability_score=random.randint(1, 100)
    )

def generate_article(article_id: str):
    # Generate content with actual words that will be counted
    content_words = [
        "news", "government", "health", "crisis", "economy",
        "policy", "international", "report", "analysis", 
        "truth", "data", "election", "climate", "security",
        "public", "official", "statement", "social", "media"
    ]
    
    # Create content with random repeated words from the list
    content = " ".join(random.choices(content_words, k=50))
    
    return Article(
        article_id=article_id,
        title=f"Analysis Report: {article_id}",
        hyperlink=f"https://news-site.com/articles/{article_id}",
        content=content,
        word_cloud=generate_word_cloud(content),
        related_articles=[generate_related_article() for _ in range(4)]
    )

def generate_related_article():
    return RelatedArticle(
        source_name=f"{random.choice(['Global', 'Daily', 'Fact'])} News",
        source_url=f"https://{random.choice(['news', 'media', 'times']).lower()}-{random.randint(1, 100)}.com"
    )


def generate_word_cloud(content: str):
    # Clean and count words from actual content
    words = [word.strip('.,').lower() for word in content.split()]
    word_counts = {}
    
    for word in words:
        if len(word) > 1:  # Ignore single characters
            word_counts[word] = word_counts.get(word, 0) + 1
    
    # Convert to WordFrequency objects
    return [
        WordFrequency(word=word, count=count)
        for word, count in word_counts.items()
    ]
def generate_source_reliability():
    score = random.randint(1, 100)
    sources = ["NewsMax", "DailyReport", "TruthWatch", "GlobalInsight", "FastFeed"]
    countries = ["USA", "UK", "Russia", "China", "Germany", "India"]
    
    return SourceReliability(
        source_score=score,
        source_name=random.choice(sources),
        source_url=f"https://www.{random.choice(sources).lower()}.com",
        country=random.choice(countries)
    )

def generate_language_score():
    propaganda_techniques = {
        "Repetition": random.randint(0, 100),
        "Whataboutism": random.randint(0, 100),
        "Causal oversimplification": random.randint(0, 100),
        "Bandwagon": random.randint(0, 100),
        "Flag-Waving": random.randint(0, 100),
        "Exaggeration": random.randint(0, 100),
        "Appeal to fear": random.randint(0, 100),
        "Prejudice": random.randint(0, 100),
        "Loaded Language": random.randint(0, 100),
        "Name Calling": random.randint(0, 100)
    }
    
    time_series = []
    for i in range(30):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        time_series.append({
            "date": date,
            "related_articles": random.randint(0, 50),
            "propaganda_score": random.randint(0, 100)
        })
    
    topics = ["Politics", "Health", "Economy", "Environment", "Technology"]
    
    return LanguageScore(
        language_score=random.randint(1, 100),
        article_text="Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        propaganda_language_detected="Use of emotional appeals, fact distortion, and loaded language.",
        topic=random.choice(topics),
        propaganda_techniques=propaganda_techniques,
        time_series_data=time_series
    )

def generate_coordination_score():
    statistics = {
        "tweets": random.randint(100, 10000),
        "sharing_users": random.randint(50, 5000),
        "total_likes": random.randint(500, 50000),
        "reach": random.randint(10000, 1000000),
        "coordinated_users_percent": random.randint(5, 70),
        "users_shared_in_coordination_otherwise_percent": random.randint(5, 50),
        "urls_shared_in_coordination_percent": random.randint(5, 80),
        "likelihood_coordination_past_behavior": random.randint(5, 95),
        "likelihood_exact_users_coordination": random.randint(5, 95)
    }
    
    timeline = []
    for i in range(30):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        timeline.append({
            "date": date,
            "tweet_count": random.randint(0, 200)
        })
    
    hashtags = [{
        "hashtag": tag,
        "count": random.randint(50, 500)
    } for i, tag in enumerate(["#fakenews", "#truth", "#scandal", "#breaking", "#exposed"])]
    
    users = [{
        "username": user,
        "retweets": random.randint(10, 100)
    } for i, user in enumerate(["@truth_seeker", "@news_watcher", "@fact_checker", "@reality_bytes", "@info_warrior"])]
    
    languages = [{
        "language": lang,
        "count": random.randint(10, 1000)
    } for i, lang in enumerate(["English", "Spanish", "Russian", "Chinese", "German"])]
    
    annotations = [{
        "annotation": annotation,
        "count": random.randint(5, 50)
    } for i, annotation in enumerate(["Breaking News", "Analysis", "Opinion", "Investigation", "Report"])]
    
    network_data = {
        "nodes": [{"id": f"user_{i}", "size": random.randint(1, 10)} for i in range(20)],
        "links": [{"source": f"user_{random.randint(0, 19)}", 
                  "target": f"user_{random.randint(0, 19)}"} for _ in range(30)]
    }
    
    return CoordinationScore(
        coordination_score=random.randint(1, 100),
        statistics=statistics,
        tweet_timeline=timeline,
        top_hashtags=hashtags,
        top_users=users,
        top_languages=languages,
        top_annotations=annotations,
        network_data=network_data
    )

def generate_bot_activity():
    bot_score = random.randint(0, 100)
    
    distribution = []
    accounts = []
    communities = {"nodes": [], "links": []}
    
    if bot_score > 0:
        distribution = [{
            "time_seconds": i * 5,
            "share_count": random.randint(0, 100)
        } for i in range(10)]
        
        accounts = [{
            "username": f"bot_network_{i+1}",
            "coordinated_sharing_within_5s": random.randint(5, 50),
            "average_sharing_time": random.randint(1, 20),
            "botometer_score": random.randint(1, 100)
        } for i in range(random.randint(1, 5))]
        
        communities = {
            "nodes": [{"id": f"bot_{i}", "size": random.randint(1, 10)} for i in range(10)],
            "links": [{"source": f"bot_{random.randint(0, 9)}", 
                      "target": f"bot_{random.randint(0, 9)}"} for _ in range(15)]
        }
    
    return BotActivity(
        bot_score=bot_score,
        sharing_time_distribution=distribution,
        suspicious_accounts=accounts,
        fast_sharing_communities=communities
    )

def generate_score_metric(source_score, language_score, coordination_score, bot_score):
    avg_score = (source_score + language_score + coordination_score + bot_score) // 4
    return ScoreMetric(
        source_score=source_score,
        language_score=language_score,
        coordination_score=coordination_score,
        bot_activity_score=bot_score,
        average_score=avg_score
    )

def generate_dashboard_data(article_id: str):
    source = generate_source_reliability()
    language = generate_language_score()
    coordination = generate_coordination_score()
    bot = generate_bot_activity()
    
    return DashboardData(
        article=generate_article(article_id),
        source_reliability=source,
        language_score=language,
        coordination_score=coordination,
        bot_activity=bot,
        score_metric=generate_score_metric(
            source.source_score,
            language.language_score,
            coordination.coordination_score,
            bot.bot_score
        )
    )

def generate_trending_topics():
    return [TrendingTopic(
        id=i,
        title=f"Trending Topic {i}",
        description=f"This is description for trending topic {i}",
        engagement=random.randint(1000, 100000),
        source_count=random.randint(5, 100),
        recent_urls=[
            f"https://example{random.randint(1, 100)}.com/article{random.randint(1, 1000)}",
            f"https://news{random.randint(1, 50)}.com/story{random.randint(1, 500)}"
        ]
    ) for i in range(1, 7)]