export type TCreateCreationDto = {
  title: string;
  code_html?: string;
  code_css?: string;
  code_js?: string;
};

export type TUpdateCreationDto = {
  title: string;
  code_html?: string;
  code_css?: string;
  code_js?: string;
};

export type TUpdateProfileDto = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
};

export type TUpdateUserReadmeDto = {
  content: string;
};

export enum EUserImageType {
  AVATAR = 'AVATAR',
  BANNER = 'BANNER',
}

export type TUploadUserImageDto = {
  file: any;
  type: EUserImageType;
};

export type TToggleStarDto = {
  // creation id
  id: string;
  // true: star, false: unstar
  toggle: boolean;
};

export type TTogglePinDto = {
  // creation id
  id: string;
  // true: pin, false: unpin
  toggle: boolean;
};

export type TToggleFollowDto = {
  // following user id
  id: string;
  // true: follow, false: unfollow
  toggle: boolean;
};

export enum EGetFollowsType {
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWEES = 'FOLLOWEES',
}
