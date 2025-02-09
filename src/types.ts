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

export type InteractionAction = "click" | "like" | "dislike" | "view";

type UserProfileInterests = {
  tags: { [tag: string]: number };
  creators: { [userIdentifier: string]: number };
};

export interface UserProfile {
  interests: UserProfileInterests;
  interactions: Array<{
    itemID: string;
    action: InteractionAction;
    timestamp: string;
  }>;
}
