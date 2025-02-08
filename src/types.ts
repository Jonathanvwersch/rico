export interface FeedItem {
  id: string;
  timestamp: string;
  title: string;
  tags: string[];
  description?: string;
  popularity?: number;
  creator?: string;
}

export interface FeedConfig {
  recencyWeight?: number;
  popularityWeight?: number;
  similarityWeight?: number;
  weights: Record<InteractionAction, number>;
}

export type InteractionAction = "click" | "like";

export interface UserProfile {
  interests: { [tag: string]: number };
  interactions: Array<{
    itemID: string;
    action: InteractionAction;
    timestamp: string;
  }>;
}
