export interface User {
  id: string;
  name: string;
  user: string;
  avatar: string;
  email: string;
  followers: Array<string>;
  followeds: Array<string>;
  location: string;
  interests: Array<string>;
}

export interface UserRecommendations {
  id: string;
  name: string;
  user: string;
}
