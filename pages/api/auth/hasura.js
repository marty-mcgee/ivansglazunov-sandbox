// @flow

import _ from 'lodash';

import { initExpress } from '../../../imports/packages/auth/express';
import { initAuthHasura, initAuthHasuraStrategy } from '../../../imports/packages/auth/hasura';
import { generateApolloClient } from '../../../imports/packages/gql';

const apolloClient = generateApolloClient({}, {
  path: _.get(process, 'env.GQL_PATH'),
  secret: _.get(process, 'env.GQL_SECRET'),
});

const app = initExpress(apolloClient);

initAuthHasuraStrategy(app, apolloClient);
initAuthHasura('/api/auth/hasura', app, apolloClient);

export default app;