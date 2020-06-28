const assert = require('chai').assert;
const validator = require('../src/util/validator.js')
const path = require('path');

describe('validator.js', function () {
  describe('isValid', function () {
    it('blank args should be valid', function () {
        assert.deepEqual({}, validator.areArgsValid({}));
    });

    it('-d should be a number', function () {
        assert.deepEqual({}, validator.areArgsValid({d: 5}));
    });

    it('args invalid if -d is not number', function () {
        assert.deepEqual({warn: 'Not valid days'}, validator.areArgsValid({d: 'foo'}));
    });
  });

  describe('getNumberOfDays', function () {
    it('blank args should return 1', function () {
        assert.equal(1, validator.getNumberOfDays({}));
    });

    it('valid number should be returned', function () {
        assert.equal(5, validator.getNumberOfDays({d: 5}));
    });
  });

  describe('validatePath', function () {
    it('should be valid if path matches cwd', function () {
        assert.deepEqual({}, validator.validatePath(path.basename(process.cwd())));
    });

    it('should not be valid if path does not match cwd', function () {
      assert.deepEqual({warn: 'Not running in the correct path'}, validator.validatePath('foo/bar'));
    });
  });
});