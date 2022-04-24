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

export type TGetFollowDto = { followee_id: string };

export type TToggleStarDto = {
  // creation id
  creation_id: string;
  // star id
  star_id: string;
};

export type TTogglePinDto = {
  // creation id
  creation_id: string;
  // star id
  pin_id: string;
};

export type TToggleFollowDto = {
  // follow the user id
  followee_id: string;
  // follow model id
  follow_id: string;
};

export enum EGetFollowsType {
  FOLLOWERS = 'FOLLOWERS',
  FOLLOWEES = 'FOLLOWEES',
}

export enum EGetCreationsType {
  STARS = 'STARS',
  PINS = 'PINS',
  CREATIONS = 'CREATIONS',
}

export type TFollowNotifyDto = {
  done?: boolean;
  notifier_id: string;
};
