import * as Jwt from 'jsonwebtoken';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import {
  describe,
  it,
  before,
  after
} from 'meteor/practicalmeteor:mocha';

import { userHasPermission } from './auth.functions';

describe('auth.functions', function() {
  describe('userHasPermission()', function() {
    let fakeToken: string = undefined;
    let verifyStub: any = undefined;

    before(function() {
      fakeToken = 'FAKE_TOKEN';

      verifyStub = sinon.stub(Jwt, 'verify').returns({
        permissions : [ 'permission_1', 'permission_2' ]
      });
    });

    after(function() {
      verifyStub.reset();
    });

    it('should return `true` if user has permissions specified', function () {
      expect(userHasPermission(fakeToken, 'permission_1')).to.be.true;
    });

    it('should return `false` if user does not have permissions specified', function () {
      expect(userHasPermission(fakeToken, 'permission_false')).to.be.false;
    });

    it('should throw an error if `token` is an empty string', function() {
      expect(userHasPermission.bind(userHasPermission, '', 'permission_1')).to.throw(Meteor.Error);
    });

    it('should throw an error if `token` is undefined', function() {
      expect(userHasPermission.bind(userHasPermission, undefined, 'permission_1')).to.throw(Meteor.Error);
    });

    it('should throw an error if `permission` is an empty string', function() {
      expect(userHasPermission.bind(userHasPermission, fakeToken, '')).to.throw(Meteor.Error);
    });

    it('should throw an error if `permission` is undefined', function() {
      expect(userHasPermission.bind(userHasPermission, fakeToken, undefined)).to.throw(Meteor.Error);
    });

    it('should throw an error if `Jwt.verify()` failed', function() {
      verifyStub.throws(new Error('verification failed'));

      expect(userHasPermission.bind(userHasPermission, fakeToken, 'permission_1')).to.throw(Meteor.Error);
    });
  });
});
