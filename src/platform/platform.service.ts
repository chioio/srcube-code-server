import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCreationDto,
  TUpdateCreationDto,
  EGetFollowsType,
  TToggleStarDto,
  TTogglePinDto,
  TToggleFollowDto,
} from './typings';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  // get trending
  async getTrending(userId: string, cursor: string, offset: number) {
    const includes: Prisma.CreationInclude = {
      stars: userId
        ? {
            select: {
              id: true,
              owner_id: true,
              creation_id: true,
            },
            where: {
              owner_id: {
                equals: userId,
              },
            },
          }
        : {
            select: {
              id: true,
              owner_id: true,
              creation_id: true,
            },
          },
      owner: {
        select: {
          id: true,
          username: true,
          user_image: {
            select: {
              avatar: true,
            },
          },
          followers: userId
            ? {
                select: {
                  id: true,
                },
                where: {
                  follower_id: {
                    equals: userId,
                  },
                },
              }
            : null,
        },
      },
      _count: {
        select: {
          stars: true,
          comments: true,
        },
      },
    };

    if (!cursor && !offset) {
      const count = await this.prisma.creation.count();

      const creations = await this.prisma.creation.findMany({
        take: 4,
        include: includes,
        orderBy: {
          id: 'asc',
        },
      });

      const hasNextPage = count > 4;

      const cursor = count > 4 ? creations[creations.length - 1].id : null;

      return {
        creations,
        cursor,
        hasPrevPage: false,
        hasNextPage: hasNextPage,
      };
    } else {
      const creations = await this.prisma.creation.findMany({
        take: Number(offset),
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: includes,
        orderBy: {
          id: 'asc',
        },
      });

      const nextCursor = creations[creations.length - 1].id;

      const restCount = await this.prisma.creation.count({
        where: {
          id:
            offset > 0
              ? {
                  gt: nextCursor,
                }
              : {
                  lt: nextCursor,
                },
        },
      });

      if (creations.length === Math.abs(offset)) {
        const hasPage =
          offset > 0
            ? { hasNextPage: !!restCount, hasPrevPage: true }
            : { hasNextPage: true, hasPrevPage: restCount > Math.abs(offset) };

        return {
          creations,
          cursor: nextCursor,
          ...hasPage,
        };
      } else {
        return {
          creations,
          cursor: nextCursor,
          hasNextPage: offset > 0 ? true : false,
          hasPrevPage: offset < 0 ? true : false,
        };
      }
    }
  }

  // get search
  async getSearch(userId: string, title: string) {
    const includes: Prisma.CreationInclude = {
      stars: userId
        ? {
            select: {
              id: true,
              owner_id: true,
              creation_id: true,
            },
            where: {
              owner_id: {
                equals: userId,
              },
            },
          }
        : null,
      owner: {
        select: {
          id: true,
          username: true,
          user_image: {
            select: {
              avatar: true,
            },
          },
          followers: userId
            ? {
                select: {
                  id: true,
                },
                where: {
                  follower_id: {
                    equals: userId,
                  },
                },
              }
            : null,
        },
      },
      _count: {
        select: {
          stars: true,
          comments: true,
        },
      },
    };

    const creations = await this.prisma.creation.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      include: includes,
    });

    return creations;
  }

  // get creation
  async getCreation(userId: string, creationId: string) {
    const isStared = userId
      ? await this.prisma.star.findUnique({
          where: {
            owner_id: userId,
            creation_id: creationId,
          },
        })
      : null;

    const includes: Prisma.CreationInclude = {
      owner: userId
        ? {
            select: {
              followers: {
                select: { id: true },
                where: {
                  follower_id: userId
                    ? {
                        equals: userId,
                      }
                    : null,
                },
              },
            },
          }
        : {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              user_image: {
                select: {
                  avatar: true,
                },
              },
            },
          },
      comments: {
        select: {
          id: true,
          creation_id: true,
          owner_id: true,
          content: true,
          created_at: true,
          owner: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              user_image: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
      stars: true,
      _count: {
        select: {
          stars: true,
          comments: true,
        },
      },
    };

    const creation = await this.prisma.creation.findUnique({
      where: {
        id: creationId,
      },
      include: includes,
    });

    const result = { creation: { ...creation, is_stared: !!isStared } };

    return result;
  }

  // create creation
  async createCreation(userId: string, dto: TCreateCreationDto) {}

  // update creation
  async updateCreation(
    userId: string,
    creationId: string,
    dto: TUpdateCreationDto,
  ) {}

  // delete creation
  async deleteCreation(userId: string, creationId: string) {}

  // get user creations
  async getUserCreations(userId: string, page: number) {
    const includes: Prisma.CreationInclude = {
      owner: {
        select: {
          id: true,
          username: true,
          user_image: {
            select: {
              avatar: true,
            },
          },
        },
      },
    };

    const creations = await this.prisma.creation.findMany({
      take: 8,
      skip: 8 * (page - 1),
      where: {
        owner_id: userId,
      },
      include: includes,
      orderBy: {
        id: 'asc',
      },
    });

    return creations;
  }

  // get user stars
  async getUserStars(userId: string, page: number) {
    const includes: Prisma.CreationInclude = {
      owner: {
        select: {
          id: true,
          username: true,
          user_image: {
            select: {
              avatar: true,
            },
          },
        },
      },
    };
  }

  // get user pins
  async getUserPins(userId: string, page: number) {
    const includes: Prisma.CreationInclude = {
      owner: {
        select: {
          id: true,
          username: true,
          user_image: {
            select: {
              avatar: true,
            },
          },
        },
      },
    };
  }

  // get user profile
  async getUserProfile(userId: string) {
    const includes: Prisma.UserInclude = {};
  }

  // update user profile
  async updateUserProfile(userId: string, dto: any) {}

  // update user readme
  async updateUserReadme(userId: string, dto: any) {}

  // upload user image
  async uploadUserImage(userId: string, file: any) {}

  // get user followers
  async getUserFollows(userId: string, page: number, type: EGetFollowsType) {
    const includes: Prisma.UserInclude = {
      followers: {},
    };
  }

  // toggle star
  async toggleStar(userId: string, dto: TToggleStarDto) {
    const { toggle, id } = dto;
    if (toggle) {
      await this.prisma.star.create({
        data: {
          owner_id: userId,
          creation_id: id,
        },
      });
    } else {
      await this.prisma.star.delete({
        where: {
          owner_id: userId,
          creation_id: id,
        },
      });
    }
  }

  // toggle pin
  async togglePin(userId: string, dto: TTogglePinDto) {
    const { toggle, id } = dto;
    if (toggle) {
      await this.prisma.pin.create({
        data: {
          owner_id: userId,
          creation_id: id,
        },
      });
    } else {
      await this.prisma.pin.delete({
        where: {
          owner_id: userId,
          creation_id: id,
        },
      });
    }
  }

  // toggle follow
  async toggleFollow(userId: string, dto: TToggleFollowDto) {
    const { toggle, id } = dto;
    if (toggle) {
      await this.prisma.follow.create({
        data: {
          follower_id: userId,
          followee_id: id,
        },
      });
    } else {
      await this.prisma.follow.delete({
        where: {
          follower_id: userId,
          followee_id: id,
        },
      });
    }
  }

  // delete account
  async deleteAccount(userId: string) {}
}
