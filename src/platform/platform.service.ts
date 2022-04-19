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
  TUpdateUserReadmeDto,
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
          profile: {
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
          profile: {
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
            id: creationId,
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
              profile: {
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
              profile: {
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

  // get user profile
  async getUserProfile(username: string) {
    const includes: Prisma.UserInclude = {
      profile: {
        select: {
          bio: true,
          org: true,
          location: true,
          website: true,
          avatar: true,
          banner: true,
        },
      },
      _count: {
        select: {
          followers: true,
          followees: true,
        },
      },
    };

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: includes,
    });

    return user;
  }

  // get user readme
  async getUserReadme(username: string) {
    // const includes: Prisma.UserInclude = {};

    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        readme: true,
      },
    });

    return user.readme;
  }

  // get user creations
  async getUserCreations(userId: string, username: string, page: number) {
    const includes: Prisma.CreationInclude = {
      owner: {
        select: {
          id: true,
          username: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
      stars: userId
        ? {
            select: {
              id: true,
            },
            where: {
              owner_id: {
                equals: userId,
              },
            },
          }
        : null,
      _count: {
        select: {
          stars: true,
          comments: true,
        },
      },
    };

    const creations = await this.prisma.creation.findMany({
      take: 8,
      skip: page ? 8 * (page - 1) : 0,
      where: {
        owner: {
          username,
        },
      },
      include: includes,
      orderBy: {
        id: 'asc',
      },
    });

    return creations;
  }

  // get user stars
  async getUserStars(userId: string, username: string, page: number) {
    const includes: Prisma.StarInclude = {
      creation: {
        select: {
          id: true,
          title: true,
          code_html: true,
          code_css: true,
          code_js: true,
          owner: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          stars: userId
            ? {
                select: {
                  id: true,
                },
                where: {
                  owner_id: {
                    equals: userId,
                  },
                },
              }
            : null,
          _count: {
            select: {
              stars: true,
              comments: true,
            },
          },
        },
      },
    };

    const stars = await this.prisma.star.findMany({
      take: 8,
      skip: page ? 8 * (page - 1) : 0,
      where: {
        owner: {
          username,
        },
      },
      include: includes,
      orderBy: {
        id: 'asc',
      },
    });

    return stars;
  }

  // get user pins
  async getUserPins(userId: string, username: string) {
    const includes: Prisma.PinInclude = {
      creation: {
        select: {
          id: true,
          title: true,
          code_html: true,
          code_css: true,
          code_js: true,
          owner: {
            select: {
              id: true,
              username: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          stars: userId
            ? {
                select: {
                  id: true,
                },
                where: {
                  owner_id: {
                    equals: userId,
                  },
                },
              }
            : null,
          _count: {
            select: {
              stars: true,
              comments: true,
            },
          },
        },
      },
    };

    const pins = await this.prisma.pin.findMany({
      take: 6,
      where: {
        owner: {
          username,
        },
      },
      include: includes,
      orderBy: {
        id: 'asc',
      },
    });

    return pins;
  }

  // update user profile
  async updateUserProfile(userId: string, dto: any) {}

  // update user readme
  async updateUserReadme(userId: string, dto: TUpdateUserReadmeDto) {
    const readme = await this.prisma.readme.upsert({
      where: {
        owner_id: userId,
      },
      update: {
        content: dto.content,
      },
      create: {
        owner_id: userId,
        content: dto.content,
      },
    });

    return readme;
  }

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
          id,
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
          id,
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
