export interface Tweet {
  id: string;
  avatar: string;
  name: string;
  username: string;
  message: string;
  createdBy: string;
  likes_count: string;
  shares_count: number;
  sharedBy: string;
  comments: number;
  likedByMe: boolean;
  sharedByMe: boolean;
}
