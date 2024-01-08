export type FollowUserData = {
  userId: number;
  name: string;
  email: string;
  userCustomId: string;
};

export type UserData = {
  user: {
    userId: number;
    name: string;
    email: string;
    userCustomId: string;
    userProfileImageUrl: string;
  };
  followingCount: number;
  followerCount: number;
  isFollowingUser?: boolean;
};
