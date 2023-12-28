export type FollowUserData = {
  userId: number;
  name: string;
  email: string;
  userCustomId: string;
};

export type UserData = {
  user: {
    id: number;
    name: string;
    email: string;
    userCustomId: string;
  };
  followingCount: number;
  followerCount: number;
  isFollowingUser?: boolean;
};
