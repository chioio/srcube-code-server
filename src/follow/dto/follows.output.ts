import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/relay.types';
import { Follow } from '../entities/follow.entity';

@ObjectType()
export class FollowsOutput extends relayTypes(Follow) {}
