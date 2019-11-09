// @flow

import _ from 'lodash';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import gql from 'graphql-tag';

import ApolloClient from 'apollo-client';

import { selectNodeIdByString } from './gql';

export const ANONYMOUS_USER_ID = 'anonymous';

export const initAuthHasuraStrategy = (app: any, apolloClient: any) => {
  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const nodeId = await selectNodeIdByString({
          apolloClient,
          format: 'txt',
          type: 'auth_token',
          value: token,
        });
        if (!nodeId) return done('!nodeId');
        return done(null, { token, nodeId });
      } catch(error) {
        done(error);
      }
    }),
  );
};

export const initAuthHasura = (path: string, app: any, apolloClient: any) => {
  app.get(
    path, 
    (req, res, next) => {
      passport.authenticate('bearer', (error, user, info) => {
        if (error) {
          return res.status(401).json({ error: error.toString() });
        }
        if (user) {
          res.status(200).json({
            'X-Hasura-Role': 'user',
            'X-Hasura-User-Id': `${user.nodeId}`,
          });
        } else {
          res.status(200).json({
            'X-Hasura-Role': 'anonymous',
            'X-Hasura-User-Id': `${ANONYMOUS_USER_ID}`,
          });
        }
      })(req, res, next);
    },
  );
};