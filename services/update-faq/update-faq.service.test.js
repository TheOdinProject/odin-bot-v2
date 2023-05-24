const discordjs = require('discord.js');
const UpdateFAQsService = require('./update-faq.service');

jest.spyOn(discordjs, 'EmbedBuilder');

describe('UpdateFAQsService', () => {
  describe('segments', () => {
    describe('when string size is divisible by segment length', () => {
      it('segments string correctly', () => {
        const string = 'The Odin Project';
        const length = 2;
        const result = UpdateFAQsService.segments(string, length);
        expect(result).toEqual(['Th', 'e ', 'Od', 'in', ' P', 'ro', 'je', 'ct']);
      });
    });
    describe('when string size is not divisible by segment length', () => {
      it('segments string correctly', () => {
        const string = 'The Odin Project';
        const length = 3;
        const result = UpdateFAQsService.segments(string, length);
        expect(result).toEqual(['The', ' Od', 'in ', 'Pro', 'jec', 't']);
      });
    });
    describe('when string size is 0', () => {
      it('returns empty array', () => {
        const string = '';
        const length = 2;
        const result = UpdateFAQsService.segments(string, length);
        expect(result).toEqual([]);
      });
    });
  });
});
