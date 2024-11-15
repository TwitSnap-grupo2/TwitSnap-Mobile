export interface Notification {
  _id: string;
  url: string;
  body: string;
  title: string;
  userId: string;
  seen: boolean;
  createdAt: string;
}
