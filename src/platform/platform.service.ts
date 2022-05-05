import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  TCreateCreationDto,
  TUpdateCreationDto,
  EGetFollowsType,
  TToggleStarDto,
  TTogglePinDto,
  TUpdateUserReadmeDto,
  EGetCreationsType,
  TToggleFollowDto,
  TFollowNotifyDto,
} from './typings';
import fs from 'fs';

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
        : null,
      pins: userId
        ? {
            select: { id: true },
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
        take: 8,
        include: includes,
        orderBy: {
          id: 'asc',
        },
      });

      const hasNextPage = count > 8;

      return {
        creations,
        startCursor: creations[0].id,
        endCursor: creations[creations.length - 1].id,
        hasPrevPage: false,
        hasNextPage: hasNextPage,
      };
    }

    if (cursor && !offset) {
      const creation = await this.prisma.creation.findUnique({
        where: {
          id: cursor,
        },
      });

      if (!creation) {
        throw new BadRequestException('Invalid cursor');
      }

      const after = await this.prisma.creation.findMany({
        where: {
          id: {
            gt: cursor,
          },
        },
        orderBy: {
          created_at: 'asc',
        },
        include: includes,
        take: 8,
      });

      const before = await this.prisma.creation.findMany({
        where: {
          id: {
            lt: cursor,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        include: includes,
        take: 4,
      });

      const gtCount = await this.prisma.creation.count({
        where: {
          id: {
            gt: cursor,
          },
        },
      });

      const ltCount = await this.prisma.creation.count({
        where: {
          id: {
            lt: cursor,
          },
        },
      });

      return {
        creations: [[before], [after.slice(0, 4)], [after.slice(4)]],
        startCursor: before[0].id,
        endCursor: after[after.length - 1].id,
        hasPrevPage: gtCount > 7,
        hasNextPage: ltCount > 3,
      };
    }

    if (cursor && offset) {
      const creations = await this.prisma.creation.findMany({
        take: offset > 0 ? Number(offset) : Number(offset),
        skip: 1,
        cursor: {
          id: cursor,
        },
        include: includes,
        orderBy: {
          id: 'asc',
        },
      });

      if (creations.length === 0) {
        return {
          creations: [],
          startCursor: '',
          endCursor: '',
          hasPrevPage: offset > 0 ? true : false,
          hasNextPage: offset < 0 ? true : false,
        };
      }

      const startCursor = creations[0].id;
      const endCursor = creations[creations.length - 1].id;

      // const beforeCount = await this.prisma.creation.count({
      //   where: {
      //     id: {
      //       lt: startCursor,
      //     },
      //   },
      // });

      // const afterCount = await this.prisma.creation.count({
      //   where: {
      //     id: {
      //       gt: endCursor,
      //     },
      //   },
      // });

      return {
        creations,
        startCursor,
        endCursor,
        hasPrevPage: true,
        hasNextPage: true,
      };
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
      pins: userId
        ? {
            select: { id: true },
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

    const result = { ...creation, is_stared: !!isStared };

    return result;
  }

  // create creation
  async createCreation(userId: string, dto: TCreateCreationDto) {
    const creation = await this.prisma.creation.create({
      data: {
        title: dto.title,
        code_html: dto.code_html,
        code_css: dto.code_css,
        code_js: dto.code_js,
        owner_id: userId,
      },
    });

    return creation;
  }

  // update creation
  async updateCreation(
    userId: string,
    creationId: string,
    dto: TUpdateCreationDto,
  ) {
    const creation = await this.prisma.creation.update({
      where: {
        id: creationId,
      },
      data: {
        title: dto.title,
        code_html: dto.code_html,
        code_css: dto.code_css,
        code_js: dto.code_js,
      },
    });

    return creation;
  }

  // delete creation
  async deleteCreation(userId: string, creationId: string) {}

  // is stared
  async isStarred(userId: string, creationId: string) {
    const result = await this.prisma.star.findFirst({
      where: {
        creation_id: {
          equals: creationId,
        },
        owner_id: {
          equals: userId,
        },
      },
    });

    return result?.id || null;
  }

  // is followed
  async isFollowed(userId: string, followeeId: string) {
    const result = await this.prisma.follow.findFirst({
      where: {
        follower_id: {
          equals: userId,
        },
        followee_id: {
          equals: followeeId,
        },
      },
    });

    return result?.id || null;
  }

  // is pinned
  async isPinned(userId: string, creationId: string) {
    const result = await this.prisma.pin.findFirst({
      where: {
        creation_id: {
          equals: creationId,
        },
        owner_id: {
          equals: userId,
        },
      },
    });

    return result?.id || null;
  }

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

    const readme = await this.prisma.readme.findFirst({
      where: {
        owner: {
          username,
        },
      },
    });

    return readme;
  }

  // get user stars, pins, creations
  async getUserCreations(
    userId: string,
    username: string,
    page: number,
    type: EGetCreationsType,
  ) {
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
      pins: userId
        ? {
            select: { id: true },
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
      take: type === EGetCreationsType.PINS ? 6 : 4,
      skip: Number(page) > 1 ? 4 * (Number(page) - 1) : 0,
      where: {
        owner:
          type === EGetCreationsType.CREATIONS
            ? {
                username,
              }
            : {},
        pins:
          type === EGetCreationsType.PINS
            ? {
                some: {
                  owner: {
                    username,
                  },
                },
              }
            : {},
        stars:
          type === EGetCreationsType.STARS
            ? {
                some: {
                  owner: {
                    username,
                  },
                },
              }
            : {},
      },
      include: includes,
      orderBy: {
        id: 'asc',
      },
    });

    const lastId = creations.length ? creations[creations.length - 1].id : null;

    const restCount = lastId
      ? await this.prisma.creation.count({
          where: {
            id: {
              gt: lastId,
            },
            owner:
              type === EGetCreationsType.CREATIONS
                ? {
                    username,
                  }
                : {},
            stars:
              type === EGetCreationsType.STARS
                ? {
                    some: {
                      owner: {
                        username,
                      },
                    },
                  }
                : {},
          },
        })
      : null;

    return {
      creations,
      hasPrevPage: page > 1,
      hasNextPage: restCount > 0,
      pageNum: Number(page),
    };

    // return creations;
  }

  // get user or owner follow
  async getUserFollow(userId: string, followeeId: string) {
    const follow = await this.prisma.follow.findMany({
      where: {
        follower_id: userId,
        followee_id: followeeId,
      },
    });

    return follow.length ? follow[0] : null;
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

  // upload user avatar
  async uploadUserAvatar(userId: string, file: Express.Multer.File) {
    const prev = await this.prisma.profile.findUnique({
      where: {
        owner_id: userId,
      },
    });

    // update user profile avatar
    const profile = await this.prisma.profile.update({
      where: {
        owner_id: userId,
      },
      data: {
        avatar: file.path,
      },
    });

    profile &&
      prev &&
      fs.rm('./' + prev.avatar, (err) => {
        if (err) throw new BadRequestException(err.syscall);
      });

    return profile;
  }

  // upload user banner
  async uploadUserBanner(userId: string, file: Express.Multer.File) {
    // update user profile banner
    const profile = await this.prisma.profile.update({
      select: {
        banner: true,
      },
      where: {
        owner_id: userId,
      },
      data: {
        banner: file.path,
      },
    });

    return profile;
  }

  // get user followers
  async getUserFollows(
    userId: string,
    username: string,
    page: number,
    type: EGetFollowsType,
  ) {
    const includes: Prisma.FollowInclude = {
      follower: type === EGetFollowsType.FOLLOWERS && {
        select: {
          id: true,
          first_name: true,
          last_name: true,
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
      followee: type === EGetFollowsType.FOLLOWEES && {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          profile: {
            select: {
              avatar: true,
            },
          },
        },
      },
    };

    const follows = await this.prisma.follow.findMany({
      take: 6,
      skip: Number(page) ? 6 * (Number(page) - 1) : 0,
      where:
        type === EGetFollowsType.FOLLOWERS
          ? {
              followee: {
                username,
              },
            }
          : {
              follower: {
                username,
              },
            },
      include: includes,
    });

    const lastId = follows.length ? follows[follows.length - 1].id : null;

    const restCount = lastId
      ? await this.prisma.follow.count({
          where:
            type === EGetFollowsType.FOLLOWERS
              ? {
                  id: {
                    gt: lastId,
                  },
                  followee: {
                    username,
                  },
                }
              : {
                  id: {
                    gt: follows[follows.length - 1].id,
                  },
                  follower: {
                    username,
                  },
                },
        })
      : null;

    console.log(restCount);

    return {
      follows,
      hasPrevPage: page > 1,
      hasNextPage: restCount > 0,
      pageNum: Number(page),
    };
  }

  // toggle star
  async toggleStar(userId: string, dto: TToggleStarDto) {
    const { creation_id, star_id } = dto;
    if (star_id) {
      await this.prisma.star.delete({
        where: {
          id: star_id,
        },
      });

      return null;
    } else {
      return await this.prisma.star.create({
        data: {
          owner_id: userId,
          creation_id,
        },
      });
    }
  }

  // toggle pin
  async togglePin(userId: string, dto: TTogglePinDto) {
    // judge pins count not allowed more than 6
    const pinsCount = await this.prisma.pin.count({
      where: {
        owner_id: userId,
      },
    });

    if (!dto.pin_id && pinsCount >= 6) {
      return {
        message: 'Pins count not allowed more than 6.',
      };
    }

    const { creation_id, pin_id } = dto;
    if (pin_id) {
      await this.prisma.pin.delete({
        where: {
          id: pin_id,
        },
      });
      return null;
    } else {
      return await this.prisma.pin.create({
        data: {
          owner_id: userId,
          creation_id,
        },
      });
    }
  }

  // toggle follow
  async toggleFollow(userId: string, dto: TToggleFollowDto) {
    const { followee_id, follow_id } = dto;
    if (follow_id) {
      await this.prisma.follow.delete({
        where: {
          id: follow_id,
        },
      });
      return null;
    } else {
      const follow = await this.prisma.follow.create({
        data: {
          follower_id: userId,
          followee_id,
        },
      });

      await this.makeFollowNotify(userId, {
        notifier_id: followee_id,
      });
      return follow;
    }
  }

  // has follow notify
  async hasFollowNotify(userId: string) {
    const count = await this.prisma.notifyFollow.count({
      where: {
        notifier_id: userId,
      },
    });

    return !!count;
  }

  // get follow notify
  async getFollowNotify(userId: string, page: number) {
    const notify = await this.prisma.notifyFollow.findMany({
      take: 6,
      skip: Number(page) ? 6 * (Number(page) - 1) : 0,
      where: {
        notifier_id: userId,
      },
    });

    const restCount = await this.prisma.notifyFollow.count({
      where: {
        id: {
          gt: notify[notify.length - 1].id,
        },
        notifier_id: userId,
      },
    });

    return {
      notify,
      hasPrevPage: page > 1,
      hasNextPage: restCount > 0,
      pageNum: Number(page),
    };
  }

  // make follow notification
  async makeFollowNotify(userId: string, dto: TFollowNotifyDto) {
    const { notifier_id, done = false } = dto;
    const notify = await this.prisma.notifyFollow.create({
      data: {
        follower_id: userId,
        notifier_id,
        done,
      },
    });

    return notify;
  }

  // delete account
  async deleteAccount(userId: string) {
    // delete profile
    await this.prisma.profile.delete({
      where: {
        owner_id: userId,
      },
    });

    // delete readme
    await this.prisma.readme.delete({
      where: {
        owner_id: userId,
      },
    });

    // delete creations
    await this.prisma.creation.deleteMany({
      where: {
        owner_id: userId,
      },
    });

    // delete comments
    await this.prisma.comment.deleteMany({
      where: {
        owner_id: userId,
      },
    });

    // delete pins
    await this.prisma.pin.deleteMany({
      where: {
        owner_id: userId,
      },
    });

    // delete stars
    await this.prisma.star.deleteMany({
      where: {
        owner_id: userId,
      },
    });

    // delete follows
    await this.prisma.follow.deleteMany({
      where: {
        follower_id: userId,
      },
    });

    // delete follows
    await this.prisma.follow.deleteMany({
      where: {
        followee_id: userId,
      },
    });

    // delete notifications
    await this.prisma.notifyFollow.deleteMany({
      where: {
        notifier_id: userId,
      },
    });

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
