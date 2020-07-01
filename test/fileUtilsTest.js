const assert = require('chai').assert;
const FileUtils = require('../src/util/fileUtils.js')
const td = require('testdouble');
const fs = require('fs');

describe('fileUtils.js', function () {
  describe('getFiles', function () {

    it('should not return folders', function () {
      const fileUtils = FileUtils.create(fs);
      let files = fileUtils.getFiles(`${process.cwd()}/test/fixtures`);
      assert.equal(2, files.length);
    });

    it('should return files modified within the given days', function () {
      const fileEnts = fs.readdirSync(`${process.cwd()}/test/fixtures`, { withFileTypes: true });
      let fakeFs = td.object(fs);
      td.when(fakeFs.readdirSync(`${process.cwd()}/test/fixtures`, { withFileTypes: true })).thenReturn(fileEnts);
      td.when(fakeFs.statSync(`${process.cwd()}/test/fixtures/foo`)).thenReturn({mtime: new Date().toString()});
      td.when(fakeFs.statSync(`${process.cwd()}/test/fixtures/bar`)).thenReturn({mtime: '2019-06-18T06:56:38.462Z'});

      const fileUtils = FileUtils.create(fakeFs);
      let files = fileUtils.getFiles(`${process.cwd()}/test/fixtures`, 1);
      assert.equal(files.length, 1);
    });

  });

  describe('findFileTarget', function () {
    let repos = [];

    before(function() {
      const basePath = `${process.cwd()}/test/src_fixture`;
      repos = [ `${basePath}/app-fin-common`, `${basePath}/app-spend-catalog` ];
    });

    beforeEach(function() {
      fs.writeFileSync(`${process.cwd()}/test/src_fixture/glide/update/customer/file1`, 'I am file1');
      fs.writeFileSync(`${process.cwd()}/test/src_fixture/glide/update/customer/file2`, 'I am file2');
      fs.writeFileSync(`${process.cwd()}/test/src_fixture/glide/update/customer/file3`, 'I am file3');
      fs.writeFileSync(`${process.cwd()}/test/src_fixture/glide/update/customer/file4`, 'I am file4');
    });

    it('should return valid file targets', function () {
      const fileUtils = FileUtils.create(fs);

      let targetPath = fileUtils.findFileTarget('file2', repos);
      assert.equal(targetPath.length, 1);
      assert.equal(targetPath[0], `${process.cwd()}/test/src_fixture/app-spend-catalog/src/main/plugins/update`);

      targetPath = fileUtils.findFileTarget('file1', repos);
      assert.equal(targetPath.length, 1);
      assert.equal(targetPath[0], `${process.cwd()}/test/src_fixture/app-fin-common/src/main/plugins/update`);
    });

    it('should return valid file targets for multi-matches', function() {
      const fileUtils = FileUtils.create(fs);
      let targetPath = fileUtils.findFileTarget('file4', repos);

      assert.equal(targetPath.length, 2);
      assert.equal(targetPath[0], `${process.cwd()}/test/src_fixture/app-fin-common/src/main/plugins/update`);
      assert.equal(targetPath[1], `${process.cwd()}/test/src_fixture/app-spend-catalog/src/main/plugins/update`);
    });

    it('should return [] if file not found', function () {
      const fileUtils = FileUtils.create(fs);

      let targetPath = fileUtils.findFileTarget('file34', repos);
      assert.equal(targetPath.length, 0);
    });

  });

  describe('moveFile', function () {
    let src = `${process.cwd()}/test/src_fixture/glide/update/customer`;
    let target = `${process.cwd()}/test/src_fixture/app-fin-common`;

    beforeEach(function() {
      fs.writeFileSync(src + '/filex', 'I am filex');
    });

    this.afterEach(function() {
      fs.unlinkSync(target + '/filex');
    });

    it('should move file to target', function () {
      const fileUtils = FileUtils.create(fs);
      fileUtils.moveFile('filex', src, target);
      assert.equal(fs.readFileSync(`${target}/filex`), 'I am filex');
    });
  });

});