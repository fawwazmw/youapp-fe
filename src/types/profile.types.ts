export interface Profile {
  displayName?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  interests?: string[];
  username?: string;
  profileImage?: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  interests?: string[];
  profileImage?: string;
}
