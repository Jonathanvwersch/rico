import type {
  FeedConfig,
  FeedItem,
  InteractionAction,
  UserProfile,
} from "./types";

export class Rico {
  private items: FeedItem[];
  private config: FeedConfig;
  private userProfile: UserProfile;


  constructor(items: FeedItem[], config?: FeedConfig) {
    this.items = items;

    this.config = {
      recencyWeight: config?.recencyWeight,
      popularityWeight: config?.popularityWeight,
      similarityWeight: config?.similarityWeight,
      weights: {
        "click": config?.weights.click ?? 1,
        "like": config?.weights.like ?? 1
      }
    };

    this.userProfile = {
      interests: {},
      interactions: [],
    };
  }

  public getRankedFeed() {}

  public logInteraction(itemID: string, action: InteractionAction): void {
    const now = new Date();
    const timestamp = now.toISOString();

    this.userProfile.interactions.push({ itemID, action, timestamp });

    const item = this.items.find((item) => item.id === itemID);
    if (item) {
      item.tags.forEach((tag) => {
        this.userProfile.interests[tag] =
          (this.userProfile.interests[tag] || 0) + 1;
      });
    }
  }

  private calculateRecencyScore(timestamp: string) {
    const now = new Date();
    const stamp = new Date(timestamp);

    const diffInMs = now.getTime() - stamp.getTime();
    const ageInSeconds = diffInMs / 1000;

    // simple decay function; older posts lessen in relevancy over time
    return 1 / (1 + ageInSeconds);
  }

  /* compare given item with user's interests */
  private calculateSimilarityScore(item: FeedItem) {
    let score = 0;

    item.tags.forEach((tag) => (score += this.userProfile.interests[tag] || 0));

    return score;
  }

  private calculatePopularityScore(item: FeedItem) {
    const clickScore = 
    

    return clickScore + likeScore + shareScore + commentScore;
  }
}
