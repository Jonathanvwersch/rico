const possibleTags = [
  "news",
  "tech",
  "sports",
  "entertainment",
  "lifestyle",
  "politics",
  "health",
  "science",
  "education",
  "business",
  "finance",
  "travel",
  "food",
  "culture",
  "music",
  "gaming",
  "movies",
  "books",
  "art",
  "fashion",
  "environment",
  "history",
  "innovation",
  "startups",
  "economy",
  "local",
  "global",
  "opinion",
  "reviews",
  "tutorials",
  "DIY",
  "outdoors",
  "fitness",
  "wellness",
  "relationships",
  "parenting",
  "comedy",
  "pets",
  "automotive",
  "real estate",
  "marketing",
  "security",
  "cryptocurrency",
  "investing",
  "social",
  "community",
  "celebrity",
  "research",
  "gadgets",
  "software",
  "hardware",
  "coding",
  "programming",
  "sustainability",
  "psychology",
  "astronomy",
  "nature",
  "wildlife",
  "space",
  "architecture",
  "design",
  "philosophy",
  "law",
  "career",
  "productivity",
];

export function getFeedItems() {
  const feedItems = [];

  for (let i = 1; i < 300; i++) {
    createNewPost(i);
  }

  return feedItems;
}

export function createNewPost(postIndex) {
  const numTags = Math.floor(Math.random() * 3 + 1);
  const tags = [];

  while (tags.length < numTags) {
    const tagIndex = Math.floor(Math.random() * tags.length);
    const tag = possibleTags[tagIndex];

    tags.push(tag);
  }

  return {
    id: `demo_item${postIndex}`,
    timestamp: new Date().toISOString(),
    title: `Demo Item ${postIndex} Title`,
    description: `Demo description for item ${postIndex}`,
    tags,
    popularity: Math.floor(Math.random() * 200),
  };
}
