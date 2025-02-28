const discordjs = require('discord.js');
const UpdateFAQsService = require('./update-faq.service');

jest.spyOn(discordjs, 'EmbedBuilder');

describe('UpdateFAQsService', () => {
  describe('segments', () => {
    describe('when string size is greater than segment length', () => {
      it('segments string correctly', () => {
        const string =
          '### The Odin Project.### Your Career in Web Development starts here';
        const delimiter = '###';
        const length = 25;
        const result = UpdateFAQsService.segments(string, length, delimiter);
        expect(result).toEqual([
          '### The Odin Project.',
          '### Your Career in Web Development starts here',
        ]);
      });
    });

    describe('when segment length is greater than string length', () => {
      it('returns a single string', () => {
        const string =
          '### The Odin Project.### Your Career in Web Development starts here';
        const delimiter = '###';
        const length = 75;
        const result = UpdateFAQsService.segments(string, length, delimiter);
        expect(result).toEqual([
          '### The Odin Project.### Your Career in Web Development starts here',
        ]);
      });
    });

    describe('when string size is 0', () => {
      it('returns array containing empty string', () => {
        const string = '';
        const length = 2;
        const result = UpdateFAQsService.segments(string, length);
        expect(result).toEqual(['']);
      });
    });

    describe('when different delimiters are used', () => {
      it('returns the string with the correct delimiter', () => {
        const string =
          '& The Odin Project.& Your Career in Web Development starts here';
        const delimiter = '&';
        const length = 25;
        const result = UpdateFAQsService.segments(string, length, delimiter);
        expect(result).toEqual([
          '& The Odin Project.',
          '& Your Career in Web Development starts here',
        ]);
      });
    });

    describe("when delimiters shouldn't be prepended", () => {
      it('returns the string without the delimiter', () => {
        const string =
          '### The Odin Project.### Your Career in Web Development starts here';
        const delimiter = '###';
        const length = 25;
        const result = UpdateFAQsService.segments(
          string,
          length,
          delimiter,
          false,
        );
        expect(result).toEqual([
          ' The Odin Project.',
          ' Your Career in Web Development starts here',
        ]);
      });
    });

    describe("when the delimiter isn't present", () => {
      it('returns the full string with the delimiter prepended', () => {
        const string =
          'The Odin Project. Your Career in Web Development starts here';
        const delimiter = '###';
        const length = 75;
        const result = UpdateFAQsService.segments(string, length, delimiter);
        expect(result).toEqual([
          '###The Odin Project. Your Career in Web Development starts here',
        ]);
      });
    });

    describe("when the delimiter isn't present and the delimiter shouldn\t be prepended", () => {
      it('returns the full string', () => {
        const string =
          'The Odin Project. Your Career in Web Development starts here';
        const delimiter = '###';
        const length = 75;
        const result = UpdateFAQsService.segments(
          string,
          length,
          delimiter,
          false,
        );
        expect(result).toEqual([
          'The Odin Project. Your Career in Web Development starts here',
        ]);
      });
    });
  });
});
