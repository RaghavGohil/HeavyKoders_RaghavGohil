"use client";

import React, { useState, useEffect } from "react";

interface TopUser {
  username: string;
  mentions: number;
}

interface TopHashtag {
  hashtag: string;
  frequency: number;
}

interface TopUsersAndHashtagsProps {
  query: string;
}

const TopUsersAndHashtags: React.FC<TopUsersAndHashtagsProps> = ({ query }) => {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [topHashtags, setTopHashtags] = useState<TopHashtag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/top-users-hashtags?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setTopUsers(data.topUsers || []);
        setTopHashtags(data.topHashtags || []);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-900 rounded-lg shadow-lg">
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Top Users Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Top Users</h2>
            {topUsers.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {topUsers.map((user, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span className="text-white font-medium">{user.username}</span>
                    <span className="text-gray-400">{user.mentions.toLocaleString()} mentions</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No top users found.</p>
            )}
          </div>

          {/* Top Hashtags Section */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Top Hashtags</h2>
            {topHashtags.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {topHashtags.map((hashtag, index) => (
                  <li key={index} className="py-2 flex justify-between items-center">
                    <span className="text-white font-medium">#{hashtag.hashtag}</span>
                    <span className="text-gray-400">{hashtag.frequency.toLocaleString()} times</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No top hashtags found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopUsersAndHashtags;
