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
} from '@nestjs/common';

import { CurrentUser, Public } from 'src/common/decorators';
import { AtGuard, OtGuard } from 'src/common/guards';
import { PlatformService } from './platform.service';
import {
  EGetFollowsType,
  TCreateCreationDto,
  TToggleFollowDto,
  TTogglePinDto,
  TToggleStarDto,
  TUpdateCreationDto,
  TUpdateProfileDto,
  TUpdateUserReadmeDto,
  TUploadUserImageDto,
} from './typings';

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
  @Post('creation/:id')
  @HttpCode(HttpStatus.OK)
  updateCreation(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: TUpdateCreationDto,
  ) {
    return this.platformService.updateCreation(userId, id, dto);
  }

  // delete creation
  @UseGuards(AtGuard)
  @Delete('creation/:id')
  @HttpCode(HttpStatus.OK)
  deleteCreation(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.platformService.deleteCreation(userId, id);
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

  // get user creations
  @Public()
  @UseGuards(OtGuard)
  @Get('user/creations')
  @HttpCode(HttpStatus.OK)
  getUserCreations(
    @CurrentUser('sub') userId: string,
    @Query('user') username: string,
    @Query('page') page: number,
  ) {
    return this.platformService.getUserCreations(userId, username, page);
  }

  // get user stars
  @Public()
  @UseGuards(OtGuard)
  @Get('user/stars')
  @HttpCode(HttpStatus.OK)
  getUserStars(
    @CurrentUser('sub') userId: string,
    @Query('user') username: string,
    @Query('page') page: number,
  ) {
    return this.platformService.getUserStars(userId, username, page);
  }

  // get user pins
  @Public()
  @UseGuards(OtGuard)
  @Get('user/pins')
  @HttpCode(HttpStatus.OK)
  getUserPins(
    @CurrentUser('sub') userId: string,
    @Query('user') username: string,
  ) {
    return this.platformService.getUserPins(userId, username);
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

  // upload user image
  @UseGuards(AtGuard)
  @Post('user/image')
  @HttpCode(HttpStatus.OK)
  uploadUserImage(
    @CurrentUser('sub') userId: string,
    @Body() dto: TUploadUserImageDto,
  ) {
    return this.platformService.uploadUserImage(userId, dto);
  }

  // get user followers
  @Public()
  @Get('user/follows')
  @HttpCode(HttpStatus.OK)
  getUserFollows(
    @Query('id') userId: string,
    @Query('page') page: number,
    @Query('type') type: EGetFollowsType,
  ) {
    return this.platformService.getUserFollows(userId, page, type);
  }

  // toggle star
  @UseGuards(AtGuard)
  @Post('toggle-star')
  @HttpCode(HttpStatus.CREATED)
  async toggleStar(
    @CurrentUser('sub') userId: string,
    @Body() dto: TToggleStarDto,
  ) {
    return this.platformService.toggleStar(userId, dto);
  }

  // toggle pin
  @UseGuards(AtGuard)
  @Post('toggle-pin')
  @HttpCode(HttpStatus.CREATED)
  async togglePin(
    @CurrentUser('sub') userId: string,
    @Body() dto: TTogglePinDto,
  ) {
    return this.platformService.togglePin(userId, dto);
  }

  // toggle follow
  @UseGuards(AtGuard)
  @Post('toggle-follow')
  @HttpCode(HttpStatus.CREATED)
  async toggleFollow(
    @CurrentUser('sub') userId: string,
    @Body() dto: TToggleFollowDto,
  ) {
    return this.platformService.toggleFollow(userId, dto);
  }

  // delete account
  @UseGuards(AtGuard)
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser('sub') userId: string) {
    return this.platformService.deleteAccount(userId);
  }
}
