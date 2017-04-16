import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { userHasPermission } from '../imports/auth.functions';

Meteor.methods({

  // TODO: Remove in PROD.
  'auth:getSampleToken': function(token: string, tokenHeader: string) {
    check(tokenHeader, String);

    if (!userHasPermission(token, 'read:silver-cubes:tasks')) {
      throw new Meteor.Error(403, 'Forbidden');
    }

    return `${tokenHeader}_${Math.random() * 10000}`;
  }
});
