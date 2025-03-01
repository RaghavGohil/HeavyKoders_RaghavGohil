"use client";

import React from "react";

interface TopUser {
  username: string;
  mentions: number;
}

interface TopHashtag {
  hashtag: string;
  frequency: number;
}

interface TopUsersAndHashtagsProps {
  topUsers: TopUser[];
  topHashtags: TopHashtag[];
}

const TopUsersAndHashtags: React.FC<TopUsersAndHashtagsProps> = ({ topUsers, topHashtags }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Top Users Section */}
      <div className="flex-1 bg-black">
        <h2 className="text-2xl font-bold text-white mb-4">Top Users</h2>
        {topUsers.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {topUsers.map((user, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span className="text-white">{user.username}</span>
                <span className="text-gray-400">
                  {user.mentions.toLocaleString()} mentions
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No top users found.</p>
        )}
      </div>

      {/* Top Hashtags Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-4">Top Hashtags</h2>
        {topHashtags.length > 0 ? (
          <ul className="divide-y divide-gray-700">
            {topHashtags.map((hashtag, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span className="text-white">#{hashtag.hashtag}</span>
                <span className="text-gray-400">
                  {hashtag.frequency.toLocaleString()} times
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No top hashtags found.</p>
        )}
      </div>
    </div>
  );
};

export default TopUsersAndHashtags;
