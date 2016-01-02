/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.filters.projectName', function() {
    var projectName;

    beforeEach(module('homeTrax.common.filters.projectName'));

    beforeEach(inject(function(_projectNameFilter_) {
      projectName = _projectNameFilter_;
    }));

    it('exists', function() {
      expect(projectName).to.exit;
    });

    describe('formatting', function() {
      it('skips format if passed object is undefined', function() {
        var name = projectName(undefined);

        expect(name).to.equal('');
      });

      it('skips format if passed object is falsy', function() {
        var invalidVar = '';
        var name = projectName(invalidVar);

        expect(name).to.equal('');
      });

      it('skips format if name is falsy', function() {
        var value = {
          jiraTaskId: 'WPM-553',
          sbvbTaskId: 'RFP12345'
        };
        var name = projectName(value);

        expect(name).to.equal('');
      });

      it('includes only the name if object only has a name', function() {
        var value={
          _id: 42,
          name: 'Douglas Adams'
        };
        var name = projectName(value);
        expect(name).to.equal('Douglas Adams');
      });

      it('includes the JIRA Task ID in square brackets', function() {
        var value={
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'WPM-123'
        };
        var name = projectName(value);
        expect(name).to.equal('Douglas Adams [WPM-123]');
      });

      it('includes the SBVB Task ID in parenthesis', function() {
        var value={
          _id: 42,
          name: 'Douglas Adams',
          sbvbTaskId: 'RFP43950'
        };
        var name = projectName(value);
        expect(name).to.equal('Douglas Adams (RFP43950)');
      });

      it('includes puts the JIRA task ID first if it has both', function() {
        var value={
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'WPM-123',
          sbvbTaskId: 'RFP43950'
        };
        var name = projectName(value);
        expect(name).to.equal('Douglas Adams [WPM-123] (RFP43950)');
      });
    });
  });
}());
