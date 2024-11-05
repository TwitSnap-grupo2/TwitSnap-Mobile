export interface Tweet {
  id: string;
  avatar: string;
  name: string;
  username: string;
  message: string;
  createdBy: string;
  likesCount: string;
  sharesCount: string;
  sharedBy: string;
  repliesCount: number;
  likedByMe: boolean;
  sharedByMe: boolean;
  parentId: string;
}
