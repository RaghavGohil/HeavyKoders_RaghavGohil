import logging
import re
from collections import Counter

from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import praw 
from gradio_client import Client
from textblob import TextBlob  # for sentiment analysis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Initialize Reddit via PRAW
try:
    reddit = praw.Reddit(
        client_id='afN4hGARPPUurk_hOfYRUA',
        client_secret='pQF1NFfG5GpKDVa2e65mU20A6e65Gg',
        user_agent='my_praw_app by /u/raghobagonewild',
        redirect_uri='http://localhost:8080/callback'
    )
    reddit.read_only = True
except Exception as e:
    logger.error("Error initializing Reddit instance: %s", e)
    raise

def is_reddit_url(text: str) -> bool:
    return "reddit.com" in text.lower()

def clean_reddit_url(url: str) -> str:
    """
    For a Reddit URL, extract the subreddit and title (replacing dashes/underscores)
    to form a query string. If not a Reddit URL, return the original URL.
    """
    match = re.search(r"https://www\.reddit\.com/r/([^/]+)/comments/([^/]+)/([^/?]+)", url)
    if match:
        subreddit, _, title = match.groups()
        cleaned_title = re.sub(r"[-_]", " ", title)
        return f"{subreddit} {cleaned_title}".strip()
    return url

def get_search_query(original_query: str) -> str:
    """
    If the query is a Reddit URL, fetch its content via PRAW and return the first 10 words;
    otherwise, return the original query.
    """
    if is_reddit_url(original_query):
        try:
            submission = reddit.submission(url=original_query)
            content = submission.title + " " + submission.selftext
            words = content.split()
            if words:
                search_query = " ".join(words[:10])
                logger.info("Converted Reddit URL to search query: %s", search_query)
                return search_query
        except Exception as e:
            logger.error("Error converting Reddit URL to search query: %s", e)
            return clean_reddit_url(original_query)
    return original_query

# Endpoint for fetching a summary from a given URL.
@app.route("/fetch_summary", methods=["POST"])
def fetch_summary_route():
    try:
        data = request.get_json()
        if not data or "query" not in data or not data["query"].strip():
            abort(400, description="Missing or empty query field in request")
        
        query = data["query"].strip()
        logger.info("Fetching summary for query: %s", query)
        
        # If the query is a Reddit URL, fetch the post's content directly.
        if is_reddit_url(query):
            submission = reddit.submission(url=query)
            content = submission.title + "\n\n" + submission.selftext
            if not content.strip():
                abort(500, description="Reddit post has no textual content to summarize.")
            client = Client("RawadAlghamdi/text-summarizer")
            result = client.predict(
                    text=content,
                    api_name="/predict"
            )
            print(result)
        else:
            # For non-Reddit URLs, pass the URL to the summarizer.
            result = client.predict(
                url=query,
                api_name="/scrape_and_summarize"
            )
        logger.info("Summary received for query: %s", query)
        return jsonify({"url": query, "summary": result})
    except Exception as e:
        logger.error("Error in /fetch_summary: %s", e)
        abort(500, description=str(e))

# Endpoint for fetching related Reddit sources.
@app.route("/related_sources", methods=["POST"])
def fetch_related_resources():
    try:
        data = request.get_json()
        if not data or "query" not in data or not data["query"].strip():
            abort(400, description="Missing or empty query field in request")
        
        original_query = data["query"].strip()
        logger.info("Received query for related sources: %s", original_query)

        # Use a plain-text search query extracted from the Reddit content if applicable.
        query = get_search_query(original_query)
        logger.info("Using search query: %s", query)

        posts = list(
            reddit.subreddit("all").search(query, limit=10, sort="relevance", syntax="plain")
        )
        logger.info("Found %d posts for query: %s", len(posts), query)

        sources = []
        for post in posts:
            if post.title and post.url:
                sources.append({
                    "text": post.title,
                    "url": post.url
                })
        if not sources:
            abort(404, description="No related sources found for the given query.")
        
        logger.info("Returning %d related sources for query: %s", len(sources), query)
        return jsonify({"url": original_query, "sources": sources})
    except Exception as e:
        logger.error("Error in /related_sources: %s", e)
        abort(500, description=str(e))

# Endpoint for generating word cloud data.
@app.route("/wordcloud", methods=["POST"])
def wordcloud_data():
    try:
        data = request.get_json()
        if not data or "query" not in data or not data["query"].strip():
            abort(400, description="Missing or empty query field in request")
        
        original_query = data["query"].strip()
        logger.info("Generating wordcloud for query: %s", original_query)

        # For Reddit URLs, fetch the post content directly; otherwise, use the summarizer.
        if is_reddit_url(original_query):
            submission = reddit.submission(url=original_query)
            main_summary = submission.title + "\n\n" + submission.selftext
        else:
            try:
                main_summary = client.predict(
                    url=original_query,
                    api_name="/scrape_and_summarize"
                )
            except Exception as e:
                logger.error("Error fetching main summary: %s", e)
                main_summary = ""
        logger.info("Main summary received.")

        # Get related Reddit posts using the derived search query.
        query = get_search_query(original_query)
        try:
            posts = list(
                reddit.subreddit("all").search(query, limit=10, sort="relevance", syntax="plain")
            )
        except Exception as e:
            logger.error("Error fetching Reddit posts: %s", e)
            posts = []
        
        reddit_texts = []
        for post in posts:
            if hasattr(post, "selftext") and post.selftext.strip():
                reddit_texts.append(post.selftext.strip())
            elif hasattr(post, "title") and post.title.strip():
                reddit_texts.append(post.title.strip())
        
        combined_text = main_summary + " " + " ".join(reddit_texts)
        if not combined_text.strip():
            abort(500, description="No text available to generate word cloud.")
        
        words = re.findall(r'\b\w+\b', combined_text.lower())
        stopwords = set([
            "the", "and", "for", "you", "that", "this", "with", "have", "are",
            "but", "not", "was", "from", "they", "will", "all", "your", "can",
            "has", "had", "been", "their", "more", "which", "when", "what",
            "about", "would", "there", "one", "just", "like", "some", "out",
            "also", "how", "its", "i", "a", "an", "in", "on", "of", "to", "is", "https", "www", "com"
        ])
        filtered_words = [w for w in words if w not in stopwords]
        counter = Counter(filtered_words)
        most_common = counter.most_common(25)
        wordcloud_info = [{"text": word, "frequency": freq} for word, freq in most_common]
        
        logger.info("Wordcloud data generated for query: %s", original_query)
        return jsonify({"query": original_query, "wordcloud": wordcloud_info})
    except Exception as e:
        logger.error("Error in /wordcloud: %s", e)
        abort(500, description=str(e))

# New endpoint for fetching top users and hashtags for a query.
@app.route("/top_metrics", methods=["POST"])
def top_metrics():
    try:
        data = request.get_json()
        if not data or "query" not in data or not data["query"].strip():
            abort(400, description="Missing or empty query field in request")
        original_query = data["query"].strip()
        logger.info("Fetching top metrics for query: %s", original_query)
        
        # Use get_search_query to get a plain-text query.
        query = get_search_query(original_query)
        logger.info("Using search query: %s", query)
        
        # Fetch posts (increase limit to 50 for better statistics).
        posts = list(
            reddit.subreddit("all").search(query, limit=50, sort="relevance", syntax="plain")
        )
        logger.info("Found %d posts for query: %s", len(posts), query)
        
        user_counter = Counter()
        hashtag_counter = Counter()
        hashtag_pattern = re.compile(r"#(\w+)")
        
        for post in posts:
            # Count authors.
            if post.author is not None:
                user_counter[post.author.name] += 1
            # Extract hashtags from title and selftext.
            hashtags_title = hashtag_pattern.findall(post.title or "")
            hashtags_selftext = hashtag_pattern.findall(post.selftext or "")
            for tag in hashtags_title + hashtags_selftext:
                hashtag_counter[tag.lower()] += 1
        
        top_users = [{"user": user, "mentions": count} for user, count in user_counter.most_common(10)]
        top_hashtags = [{"hashtag": tag, "count": count} for tag, count in hashtag_counter.most_common(10)]
        
        logger.info("Top metrics generated for query: %s", original_query)
        return jsonify({
            "query": original_query,
            "top_users": top_users,
            "top_hashtags": top_hashtags
        })
    except Exception as e:
        logger.error("Error in /top_metrics: %s", e)
        abort(500, description=str(e))

if __name__ == "__main__":
    app.run(debug=True, port=8000)
