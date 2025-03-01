"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Post {
  id: number;
  platform: string;
  username: string;
  content: string;
  engagement: { likes: number; shares: number; comments: number };
  timestamp: string;
}

interface TopPostsProps {
  posts: Post[];
}

const TopPosts: React.FC<TopPostsProps> = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-black rounded-lg border border-gray-600">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs mr-2">
                {post.platform.charAt(0)}
              </div>
              <span className="text-gray-300 font-medium">{post.username}</span>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(post.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p className="text-white mb-3">{post.content}</p>
          <div className="flex space-x-4 text-sm text-gray-400">
            <span>❤️ {post.engagement.likes.toLocaleString()}</span>
            <span>🔄 {post.engagement.shares.toLocaleString()}</span>
            <span>💬 {post.engagement.comments.toLocaleString()}</span>
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Link
          href="/more-posts"
          className="flex items-center justify-center text-gray-300 hover:text-gray-200 font-medium transition-colors"
        >
          View More Posts <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default TopPosts;
