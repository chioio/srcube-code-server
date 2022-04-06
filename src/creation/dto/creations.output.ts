import { ObjectType } from '@nestjs/graphql';
import relayTypes from 'src/relay.types';
import { Creation } from '../schema/creation';

@ObjectType()
export class CreationsOutput extends relayTypes<Creation>(Creation) {}
