import { User, UserImage } from '@prisma/client';

export type TJwtPayload = {
  sub: string;
  user: string;
};

export type TWhoAmI = Omit<
  User & {
    user_image: UserImage;
  },
  'password' | 'hashed_rt' | 'created_at' | 'updated_at'
>;

export type TTokensVo = {
  access_token: string;
  refresh_token: string;
};

export enum EAccountType {
  USERNAME = 'USERNAME',
  EMAIL = 'EMAIL',
}

export type TExistedCheckVo = {
  isExisted: boolean;
};

export type TExistedCheckDto = {
  type: EAccountType;
  value: string;
};

export type TSignInDto = {
  account: string;
  password: string;
  type: EAccountType;
};

export type TSignUpDto = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
};
