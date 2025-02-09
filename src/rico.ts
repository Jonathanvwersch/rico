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

    // Merge defaults with provided config.
    const defaultConfig: FeedConfig = {
      recencyWeight: 1,
      popularityWeight: 1,
      similarityWeight: 1,
      weights: {
        click: 1.5,
        like: 1.5,
        dislike: 0.5,
        view: 0.5,
      },
    };

    this.config = {
      ...defaultConfig,
      ...config,
      weights: {
        ...defaultConfig.weights,
        ...config?.weights,
      },
    };

    this.userProfile = {
      interests: { tags: {}, creators: {} },
      interactions: [],
    };
  }

  public getRankedFeed(): FeedItem[] {
    const itemsWithScore = this.items.map((item) => {
      const totalScore = this.calculateFinalScore(item);
      return { ...item, score: totalScore };
    });

    return itemsWithScore.sort((a, b) => b.score - a.score);
  }

  public logInteraction(itemID: string, action: InteractionAction): void {
    const timestamp = new Date().toISOString();
    this.userProfile.interactions.push({ itemID, action, timestamp });

    let increaseWeight = 1;
    if (action === "click") {
      increaseWeight *= this.config.weights.click;
    } else if (action === "like") {
      increaseWeight *= this.config.weights.like;
    } else if (action === "dislike") {
      increaseWeight *= this.config.weights.dislike;
    }

    this.updateUserProfileScores(itemID, increaseWeight);
  }

  private calculateFinalScore(item: FeedItem) {
    const recencyScore = this.calculateRecencyScore(item.timestamp);
    const similarityScore = this.calculateSimilarityScore(item);

    let totalScore =
      recencyScore * (this.config.recencyWeight ?? 1) +
      similarityScore * (this.config.similarityWeight ?? 1);

    totalScore *= this.getDerankMultiplier(item.id);

    return totalScore;
  }

  private calculateRecencyScore(timestamp: string): number {
    const now = new Date();
    const stamp = new Date(timestamp);
    const diffInMs = now.getTime() - stamp.getTime();
    const ageInSeconds = diffInMs / 1000;
    return 1 / (1 + ageInSeconds);
  }

  /*
    Compare given item with user's interests.
    When a new item is added, we calculate its score based on 
    how much the user likes the item's creator and associated tags.
  */
  private calculateSimilarityScore(item: FeedItem): number {
    let tagScore = 0;
    let creatorScore = 0;

    if (item.creator) {
      creatorScore = this.userProfile.interests.creators[item.creator] || 0;
    }

    item.tags.forEach(
      (tag) => (tagScore += this.userProfile.interests.tags[tag] || 0)
    );

    return tagScore + creatorScore;
  }

  private updateUserProfileScores(itemID: string, weight: number): void {
    const item = this.items.find((item) => item.id === itemID);
    if (item) {
      item.tags.forEach((tag) => {
        this.userProfile.interests.tags[tag] =
          (this.userProfile.interests.tags[tag] || 0) + weight;
      });
      if (item.creator) {
        this.userProfile.interests.creators[item.creator] =
          (this.userProfile.interests.creators[item.creator] || 0) + weight;
      }
    }
  }

  private getDerankMultiplier(itemID: string): number {
    const hasInteracted = this.userProfile.interactions.some(
      (interaction) =>
        interaction.itemID === itemID && interaction.action === "view"
    );
    return hasInteracted ? 0.5 : 1;
  }
}
