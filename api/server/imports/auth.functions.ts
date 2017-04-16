import * as Jwt from 'jsonwebtoken';
import { Meteor } from 'meteor/meteor';

export function userHasPermission(token: string, permission: string): boolean {
  let clientSecret: string;
  let payload = undefined;

  if (!(token && typeof token === 'string' && token.length > 0)) {
    throw new Meteor.Error(400, 'Invalid token. ');
  }

  if (!(permission && typeof permission === 'string' && permission.length > 0)) {
    throw new Meteor.Error(400, 'Invalid permission');
  }

  clientSecret = getClientSecret();

  if (!(clientSecret && typeof clientSecret === 'string' && clientSecret.length > 0)) {
    throw new Meteor.Error(500, 'Failed to decode token, ');
  }

  try {
    payload = Jwt.verify(token, clientSecret);
  } catch (error) {
    throw new Meteor.Error(500, `${error.name}: ${error.message}`);
  }

  const permissions: string[] = (payload && Object.prototype.hasOwnProperty.call(payload, 'permissions')) ?
    payload.permissions : [];

  return permissions.indexOf(permission) > -1;
}

function getClientSecret(): string {
  let clientSecret: string;

  try {
    clientSecret = Meteor.settings.private.auth.clientSecret;
  } catch (error) {
    throw new Meteor.Error(500, 'Invalid server auth settings. ');
  }

  return clientSecret;
}
