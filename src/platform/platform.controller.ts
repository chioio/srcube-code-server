import {
  Controller,
  Get,
  Query,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

import { CurrentUser, Public } from 'src/common/decorators';
import { AtGuard, OtGuard } from 'src/common/guards';
import { PlatformService } from './platform.service';
import {
  EGetCreationsType,
  EGetFollowsType,
  TCreateCommentDto,
  TCreateCreationDto,
  TToggleFollowDto,
  TTogglePinDto,
  TToggleStarDto,
  TUpdateCreationDto,
  TUpdateProfileDto,
  TUpdateUserReadmeDto,
} from './typings';
import { Response } from 'express';
import { nanoid } from 'nanoid';

const multerImageOptions = {
  storage: multer.diskStorage({
    destination: './uploads/avatar',
    filename: (req, file, cb) => {
      const fileExtension = file.originalname.split('.').pop();

      return cb(null, `${nanoid(16)}.${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    Logger.log(file);

    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Please upload only images'), false);
    }
  },
};

@Controller()
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  // get trending
  @Public()
  @UseGuards(OtGuard)
  @Get('trending')
  @HttpCode(HttpStatus.OK)
  getTrending(
    @CurrentUser('sub') userId: string,
    @Query('cursor') cursor?: string,
    @Query('offset') offset?: number,
  ) {
    return this.platformService.getTrending(userId, cursor, offset);
  }

  // get search
  @Public()
  @UseGuards(OtGuard)
  @Get('search')
  @HttpCode(HttpStatus.OK)
  getSearch(@CurrentUser('sub') userId: string, @Query('q') q: string) {
    return this.platformService.getSearch(userId, q);
  }

  // get creation
  @Public()
  @UseGuards(OtGuard)
  @Get('creation')
  @HttpCode(HttpStatus.OK)
  getCreation(@CurrentUser('sub') userId: string, @Query('id') id: string) {
    return this.platformService.getCreation(userId, id);
  }

  // create creation
  @UseGuards(AtGuard)
  @Post('creation')
  @HttpCode(HttpStatus.CREATED)
  createCreation(
    @CurrentUser('sub') userId: string,
    @Body() dto: TCreateCreationDto,
  ) {
    return this.platformService.createCreation(userId, dto);
  }

  // update creation
  @UseGuards(AtGuard)
  @Post('creation/update')
  @HttpCode(HttpStatus.OK)
  updateCreation(
    @CurrentUser('sub') userId: string,
    @Query('id') id: string,
    @Body() dto: TUpdateCreationDto,
  ) {
    return this.platformService.updateCreation(userId, id, dto);
  }

  // delete creation
  @UseGuards(AtGuard)
  @Delete('creation')
  @HttpCode(HttpStatus.OK)
  deleteCreation(@CurrentUser('sub') userId: string, @Query('creation_id') id: string) {
    return this.platformService.deleteCreation(userId, id);
  }

  // get stars
  @Public()
  @UseGuards(OtGuard)
  @Get('creation/stars')
  @HttpCode(HttpStatus.OK)
  getStars(
    @CurrentUser('sub') userId: string,
    @Query('creation_id') creationId: string,
  ) {
    return this.platformService.getStars(creationId);
  }

  // create comment
  @UseGuards(AtGuard)
  @Post('creation/comment')
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @CurrentUser('sub') userId: string,
    @Body() dto: TCreateCommentDto,
  ) {
    return this.platformService.createComment(userId, dto);
  }

  // get comments
  @Public()
  @UseGuards(OtGuard)
  @Get('creation/comments')
  @HttpCode(HttpStatus.OK)
  getComments(
    @CurrentUser('sub') userId: string,
    @Query('creation_id') creationId: string,
  ) {
    return this.platformService.getComments(creationId);
  }

  // is starred
  @UseGuards(AtGuard)
  @Get('creation/is-starred')
  @HttpCode(HttpStatus.OK)
  isStarred(
    @CurrentUser('sub') userId: string,
    @Query('creation_id') creationId: string,
  ) {
    return this.platformService.isStarred(userId, creationId);
  }

  // is pinned
  @UseGuards(AtGuard)
  @Get('creation/is-pinned')
  isPinned(
    @CurrentUser('sub') userId: string,
    @Query('creation_id') creationId: string,
  ) {
    return this.platformService.isPinned(userId, creationId);
  }

  // is followed
  @UseGuards(AtGuard)
  @Get('follow/is-followed')
  isFollowed(
    @CurrentUser('sub') userId: string,
    @Query('followee_id') followeeId: string,
  ) {
    return this.platformService.isFollowed(userId, followeeId);
  }

  // get user profile
  @Public()
  @Get('user/profile')
  @HttpCode(HttpStatus.OK)
  getUserProfile(@Query('user') username: string) {
    return this.platformService.getUserProfile(username);
  }

  // update user profile
  @UseGuards(AtGuard)
  @Post('user/profile')
  @HttpCode(HttpStatus.OK)
  updateUserProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: TUpdateProfileDto,
  ) {
    return this.platformService.updateUserProfile(userId, dto);
  }

  // get user readme
  @Public()
  @Get('user/readme')
  getUserReadme(@Query('user') username: string) {
    return this.platformService.getUserReadme(username);
  }

  // get user stars, pins, creations
  @Public()
  @UseGuards(OtGuard)
  @Get('user/creations')
  @HttpCode(HttpStatus.OK)
  getUserCreations(
    @CurrentUser('sub') userId: string,
    @Query('user') username: string,
    @Query('page') page: number,
    @Query('type') type: EGetCreationsType,
  ) {
    return this.platformService.getUserCreations(userId, username, page, type);
  }

  // get user or owner follower
  @UseGuards(AtGuard)
  @Get('user/follow')
  @HttpCode(HttpStatus.OK)
  getUserFollow(
    @CurrentUser('sub') userId: string,
    @Query('followee_id') followeeId: string,
  ) {
    return this.platformService.getUserFollow(userId, followeeId);
  }

  // update user readme
  @UseGuards(AtGuard)
  @Put('user/readme')
  @HttpCode(HttpStatus.OK)
  updateUserReadme(
    @CurrentUser('sub') userId: string,
    @Body() dto: TUpdateUserReadmeDto,
  ) {
    return this.platformService.updateUserReadme(userId, dto);
  }

  // upload user avatar
  @UseGuards(AtGuard)
  @Post('user/upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerImageOptions))
  @HttpCode(HttpStatus.OK)
  uploadUserAvatar(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      return this.platformService.uploadUserAvatar(userId, file);
    }
  }

  // upload user banner
  @UseGuards(AtGuard)
  @Post('user/upload-banner')
  @UseInterceptors(FileInterceptor('file', multerImageOptions))
  @HttpCode(HttpStatus.OK)
  uploadUserBanner(
    @CurrentUser('sub') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      const res = {
        avatar: file.path,
      };
      return res;
    }
  }

  // read image file
  @Public()
  @Get('uploads/:type/:filename')
  async getImage(
    @Param('type') type: 'avatar' | 'banner',
    @Param('filename') filename,
    @Res() res: Response,
  ) {
    res.sendFile(filename, {
      root:
        (type === 'avatar' && './uploads/avatar') ||
        (type === 'banner' && './uploads/banner'),
    });
  }

  // get user followers
  @Public()
  @UseGuards(OtGuard)
  @Get('user/follows')
  @HttpCode(HttpStatus.OK)
  getUserFollows(
    @CurrentUser('sub') userId: string,
    @Query('user') username: string,
    @Query('page') page: number,
    @Query('type') type: EGetFollowsType,
  ) {
    return this.platformService.getUserFollows(userId, username, page, type);
  }

  // toggle star
  @UseGuards(AtGuard)
  @Put('user/toggle-star')
  @HttpCode(HttpStatus.CREATED)
  async toggleStar(
    @CurrentUser('sub') userId: string,
    @Body() dto: TToggleStarDto,
  ) {
    return this.platformService.toggleStar(userId, dto);
  }

  // toggle pin
  @UseGuards(AtGuard)
  @Put('user/toggle-pin')
  @HttpCode(HttpStatus.CREATED)
  async togglePin(
    @CurrentUser('sub') userId: string,
    @Body() dto: TTogglePinDto,
  ) {
    return this.platformService.togglePin(userId, dto);
  }

  // toggle follow
  @UseGuards(AtGuard)
  @Put('user/toggle-follow')
  @HttpCode(HttpStatus.CREATED)
  async toggleFollow(
    @CurrentUser('sub') userId: string,
    @Body() dto: TToggleFollowDto,
  ) {
    return this.platformService.toggleFollow(userId, dto);
  }

  // delete account
  @UseGuards(AtGuard)
  @Delete('user/account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser('sub') userId: string) {
    return this.platformService.deleteAccount(userId);
  }
}
