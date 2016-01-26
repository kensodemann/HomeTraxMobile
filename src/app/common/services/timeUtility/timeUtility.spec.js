/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.timeUtility', function() {
    var timeUtility;

    beforeEach(module('homeTrax.common.services.timeUtility'));

    beforeEach(inject(function(_timeUtility_) {
      timeUtility = _timeUtility_;
    }));

    it('exists', function() {
      expect(timeUtility).to.exist;
    });

    describe('parse', function() {
      it('returns undefined if nothing is passed', function() {
        expect(timeUtility.parse()).to.be.undefined;
      });

      describe('x.xx format', function() {
        it('returns X hours as milliseconds', function() {
          expect(timeUtility.parse('3')).to.equal(10800000);
        });

        it('returns .XYZ hours as milliseconds', function() {
          expect(timeUtility.parse('.123')).to.equal(442800);
        });

        it('returns 0.XYZ hours as milliseconds', function() {
          expect(timeUtility.parse('0.123')).to.equal(442800);
        });

        it('returns X.YZ hours as milliseconds', function() {
          expect(timeUtility.parse('12.34')).to.equal(44424000);
        });

        it('treats a number (not a string) as number of hours', function() {
          expect(timeUtility.parse(3)).to.equal(10800000);
        });
      });

      describe('x:xx format', function() {
        it('returns X:YZ as x hours and yz minutes in milliseconds', function() {
          expect(timeUtility.parse('4:12')).to.equal(15120000);
        });

        it('returns :YZ as yz minutes in milliseconds', function() {
          expect(timeUtility.parse(':37')).to.equal(2220000);
        });

        it('returns 0:YZ as yz minutes in milliseconds', function() {
          expect(timeUtility.parse('0:37')).to.equal(2220000);
        });

        it('parses one minute', function() {
          expect(timeUtility.parse('0:01')).to.equal(60000);
        });

        it('parses 59 minutes', function() {
          expect(timeUtility.parse('0:59')).to.equal(3540000);
        });

        it('parses 1 hour', function() {
          expect(timeUtility.parse('1:00')).to.equal(3600000);
        });
      });

      describe('Invalid formats', function() {
        it('throws an error if letters are included', function() {
          expect(function() {
            timeUtility.parse('A:37');
          }).to.throw('Invalid format');
        });

        it('throws an error if there is a "." and a ":"', function() {
          expect(function() {
            timeUtility.parse('1.25:37');
          }).to.throw('Invalid format');
        });

        it('throws an error if there is more than one "."', function() {
          expect(function() {
            timeUtility.parse('1.25.34');
          }).to.throw('Invalid format');
        });

        it('throws an error if there is more than one ":"', function() {
          expect(function() {
            timeUtility.parse('1:34:37');
          }).to.throw('Invalid format');
        });

        it('throws an error if there are more than two digits after the ":"', function() {
          expect(function() {
            timeUtility.parse('1:373');
          }).to.throw('Invalid format');
        });

        it('throws an error if there are less than two digits after the ":"', function() {
          expect(function() {
            timeUtility.parse('1:3');
          }).to.throw('Invalid format');
        });

        it('throws an error for negative numbers', function() {
          expect(function() {
            timeUtility.parse('-1');
          }).to.throw('Invalid format');
        });

        it('throws an error if the value after the ":" is greater than 59', function() {
          expect(function() {
            timeUtility.parse('1:60');
          }).to.throw('Invalid format');
        });
      });
    });
  });
}());
