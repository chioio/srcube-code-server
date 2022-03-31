import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate({
  typePaths: ['./**/*.gql'],
  path: join(process.cwd(), '../srcube-code-client/lib/api/schema.ts'),
  outputAs: 'interface',
  // watch: true,
});
