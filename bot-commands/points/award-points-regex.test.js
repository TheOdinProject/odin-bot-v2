const awardPoints = require('./award-points-mongo');

describe('command', () => {
  it('has the name "award points"', () => {
    expect(awardPoints.name).toBe('award points');
  });
});

describe('regex', () => {
  describe('++', () => {
    it.each([
      ['<@!123456789>++'],
      ['<@!123456789> ++'],
      ['<@!123456789> +++'],
      ['<@!123456789> ++++++++++++'],
      ['thanks<@!123456789> ++'],
      ['thanks <@!123456789> ++'],
      ['thanks <@!123456789>      ++'],
      ['thanks <@!123456789>                 ++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot++'],
      ['/++'],
      ['`<@!123456789> ++`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ++'],
      ["Don't worry about it <@!123456789> ++"],
      ['Hey <@!123456789> ++'],
      ['/ <@!123456789> ++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ++!'],
      ['<@!123456789> ++/'],
      ['<@!123456789> ++,'],
      ['<@!123456789> ++...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([
      ['<@!123456789> ++i'], // e.g. prevents points if pinging to ask about pre-increment syntax
      ['<@!123456789> ++yes'],
      ['<@!123456789> ++_'],
      ['<@!123456789> ++8'],
    ])(
      "'%s' - command cannot be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeFalsy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ++'.match(awardPoints.regex)).toBeFalsy();
    });
  });

  describe('?++', () => {
    it.each([
      ['<@!123456789>?++'],
      ['<@!123456789> ?++'],
      ['<@!123456789> ?+++'],
      ['<@!123456789> ?++++++++++++'],
      ['<@!123456789>     ?++++++++++++'],
      ['<@!123456789>          ?++++++++++++'],
      ['thanks <@!123456789> ?++'],
      ['thanks<@!123456789> ?++'],
    ])("%s' - triggers the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['?++'],
      [''],
      [' '],
      [' /'],
      ['odin-bot?++'],
      ['/?++'],
      ['`<@!123456789> ?++`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ?++'],
      ["Don't worry about it <@!123456789> ?++"],
      ['Hey <@!123456789> ?++'],
      ['/ <@!123456789> ?++ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ?++!'],
      ['<@!123456789> ?++/'],
      ['<@!123456789> ?++,'],
      ['<@!123456789> ?++...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([
      ['<@!123456789> ?++i'],
      ['<@!123456789> ?++yes'],
      ['<@!123456789> ?++_'],
      ['<@!123456789> ?++8'],
    ])(
      "'%s' - command cannot be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeFalsy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ?++'.match(awardPoints.regex)).toBeFalsy();
    });
  });

  describe('⭐', () => {
    it.each([
      ['<@!123456789>⭐'],
      ['<@!123456789> ⭐'],
      ['<@!123456789>     ⭐'],
      ['thanks <@!123456789> ⭐'],
      ['thanks<@!123456789> ⭐'],
    ])("'%s' - correct strings trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['⭐'],
      [''],
      [' '],
      [' /'],
      ['odin-bot⭐'],
      ['/⭐'],
      ['`<@!123456789> ⭐`'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(string.match(awardPoints.regex)).toBeFalsy();
    });

    it.each([
      ['Check this out! <@!123456789> ⭐'],
      ["Don't worry about it <@!123456789> ⭐"],
      ['Hey <@!123456789> ⭐'],
      ['/ <@!123456789> ⭐ ^ /me /leaderboard /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(string.match(awardPoints.regex)).toBeTruthy();
    });

    it.each([
      ['<@!123456789> ⭐!'],
      ['<@!123456789> ⭐/'],
      ['<@!123456789> ⭐,'],
      ['<@!123456789> ⭐...'],
    ])(
      "'%s' - command can be immediately followed by a non-word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it.each([['<@!123456789> ⭐thanks'], ['<@!123456789> ⭐yes']])(
      "'%s' - :star: command can be immediately followed by a word character",
      (string) => {
        expect(string.match(awardPoints.regex)).toBeTruthy();
      },
    );

    it('does not match if the user mention is escaped', () => {
      expect('\\<@!123456789> ⭐'.match(awardPoints.regex)).toBeFalsy();
    });
  });
});
