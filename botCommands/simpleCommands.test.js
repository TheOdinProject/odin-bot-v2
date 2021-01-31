const commands = require('./simpleCommands');

describe('/hug', () => {
  describe('regex', () => {
    it.each([['/hug'], [' /hug'], ['/hug @odin-bot'], ['@odin-bot /hug']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.hug.regex.test(string)).toBeTruthy();
      }
    );

    it.each([
      ['/hg'],
      ['hug'],
      ['/hu'],
      ['/hugs'],
      ['```function("/hug", () => {}```'],
      ['/Hug'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / hug'],
      ['/hu&g'],
      ['/hu^g'],
      ['/hug!'],
      ['@odin-bot/ hug'],
      ['https://hug.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.hug.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /hug'],
      ["Don't worry about /hug"],
      ['Hey @odin-bot, /hug'],
      ['/@odin-bot ^ /me /hug /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.hug.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/hug'],
      ["it's about/hug"],
      ['/hugisanillusion'],
      ['/hug/'],
      ['/hug*'],
      ['/hug...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.hug.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.hug.cb()).toMatchSnapshot();
    });
  });
});

describe('/smart', () => {
  describe('regex', () => {
    it.each([
      ['/smart'],
      [' /smart'],
      ['/smart @odin-bot'],
      ['@odin-bot /smart'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.smart.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/smar'],
      ['smart'],
      ['/smrt'],
      ['/smarts'],
      ['```function("/smart", () => {}```'],
      // ['/smart'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / smart'],
      ['/sma&rt'],
      ['/sma^rt'],
      ['/smart!'],
      ['@odin-bot/ smart'],
      ['https://smart.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.smart.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /smart'],
      ["Don't worry about /smart"],
      ['Hey @odin-bot, /smart'],
      ['/@odin-bot ^ /me /smart /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.smart.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/smart'],
      ["it's about/smart"],
      ['/smartisanillusion'],
      ['/smart/'],
      ['/smart*'],
      ['/smart...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.smart.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.smart.cb()).toMatchSnapshot();
    });
  });
});

describe('/lenny', () => {
  describe('regex', () => {
    it.each([
      ['/lenny'],
      [' /lenny'],
      ['/lenny @odin-bot'],
      ['@odin-bot /lenny'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.lenny.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/hg'],
      ['lenny'],
      ['/hu'],
      ['/lennys'],
      ['```function("/lenny", () => {}```'],
      // ['/lenny'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / lenny'],
      ['/hu&g'],
      ['/hu^g'],
      ['/lenny!'],
      ['@odin-bot/ lenny'],
      ['https://lenny.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.lenny.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /lenny'],
      ["Don't worry about /lenny"],
      ['Hey @odin-bot, /lenny'],
      ['/@odin-bot ^ /me /lenny /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.lenny.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/lenny'],
      ["it's about/lenny"],
      ['/lennyisanillusion'],
      ['/lenny/'],
      ['/lenny*'],
      ['/lenny...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.lenny.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.lenny.cb()).toMatchSnapshot();
    });
  });
});

describe('/fu', () => {
  describe('regex', () => {
    it.each([['/fu'], [' /fu'], ['/fu @odin-bot'], ['@odin-bot /fu']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.fu.regex.test(string)).toBeTruthy();
      }
    );

    it.each([
      ['/f'],
      ['fu'],
      ['/fuu'],
      ['/fus'],
      ['```function("/fu", () => {}```'],
      // ['/fu'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / fu'],
      ['/f&u'],
      ['/f^u'],
      ['/fu!'],
      ['@odin-bot/ fu'],
      ['https://fu.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.fu.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /fu'],
      ["Don't worry about /fu"],
      ['Hey @odin-bot, /fu'],
      ['/@odin-bot ^ /me /fu /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.fu.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/fu'],
      ["it's about/fu"],
      ['/fuisanillusion'],
      ['/fu/'],
      ['/fu*'],
      ['/fu...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.fu.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      const fu = jest.fn(
        (str) =>
          'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif'
      );
      expect(fu(':fu:')).toMatchSnapshot();
    });
  });
});

describe('/question', () => {
  describe('regex', () => {
    it.each([
      ['/question'],
      [' /question'],
      ['/question @odin-bot'],
      ['@odin-bot /question'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.question.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/quest'],
      ['question'],
      ['/questio'],
      ['/questions'],
      ['```function("/question", () => {}```'],
      // ['/question'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / question'],
      ['/ques&tion'],
      ['/quest^ion'],
      ['/question!'],
      ['@odin-bot/ question'],
      ['https://question.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.question.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /question'],
      ["Don't worry about /question"],
      ['Hey @odin-bot, /question'],
      ['/@odin-bot ^ /me /question /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.question.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/question'],
      ["it's about/question"],
      ['/questionisanillusion'],
      ['/question/'],
      ['/question*'],
      ['/question...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.question.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.question.cb()).toMatchSnapshot();
    });
  });
});

describe('/data', () => {
  describe('regex', () => {
    it.each([['/data'], [' /data'], ['/data @odin-bot'], ['@odin-bot /data']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.data.regex.test(string)).toBeTruthy();
      }
    );

    it.each([
      ['/dat'],
      ['data'],
      ['/daa'],
      ['/datas'],
      ['```function("/data", () => {}```'],
      // ['/data'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / data'],
      ['/da&ta'],
      ['/da^ta'],
      ['/data!'],
      ['@odin-bot/ data'],
      ['https://data.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.data.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /data'],
      ["Don't worry about /data"],
      ['Hey @odin-bot, /data'],
      ['/@odin-bot ^ /me /data /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.data.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/data'],
      ["it's about/data"],
      ['/dataisanillusion'],
      ['/data/'],
      ['/data*'],
      ['/data...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.data.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.data.cb()).toMatchSnapshot();
    });
  });
});

describe('/sexpresso', () => {
  describe('regex', () => {
    it.each([
      ['/sexpresso'],
      [' /sexpresso'],
      ['/sexpresso @odin-bot'],
      ['@odin-bot /sexpresso'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.sexpresso.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/sexpress'],
      ['sexpresso'],
      ['/sexpreso'],
      ['/sexpressos'],
      ['```function("/sexpresso", () => {}```'],
      ['/s'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / sexpresso'],
      ['/sexp&resso'],
      ['/sexpress^o'],
      ['/sexpresso!'],
      ['@odin-bot/ sexpresso'],
      ['https://sexpresso.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.sexpresso.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /sexpresso'],
      ["Don't worry about /sexpresso"],
      ['Hey @odin-bot, /sexpresso'],
      ['/@odin-bot ^ /me /sexpresso /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.sexpresso.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/sexpresso'],
      ["it's about/sexpresso"],
      ['/sespressoisanillusion'],
      ['/sexpresso/'],
      ['/sexpresso*'],
      ['/sexpresso...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.sexpresso.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.sexpresso.cb()).toMatchSnapshot();
    });
  });
});

describe('/peen', () => {
  describe('regex', () => {
    it.each([['/peen'], [' /peen'], ['/peen @odin-bot'], ['@odin-bot /peen']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.peen.regex.test(string)).toBeTruthy();
      }
    );

    it.each([
      ['/pen'],
      ['peen'],
      ['/pee'],
      ['/peens'],
      ['```function("/peen", () => {}```'],
      // ['/peen'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / peen'],
      ['/pe&en'],
      ['/pe^en'],
      ['/peen!'],
      ['@odin-bot/ peen'],
      ['https://peen.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.peen.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /peen'],
      ["Don't worry about /peen"],
      ['Hey @odin-bot, /peen'],
      ['/@odin-bot ^ /me /peen /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.peen.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/peen'],
      ["it's about/peen"],
      ['/peenisanillusion'],
      ['/peen/'],
      ['/peen*'],
      ['/peen...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.peen.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(
        commands.peen.cb({
          author: {
            id: 418918922507780096,
          },
        })
      ).toMatchSnapshot();
    });
  });
});

describe('/google', () => {
  describe('regex', () => {
    it.each([
      ['/google query'],
      [' /google query'],
      ['/google query @odin-bot'],
      ['@odin-bot /google query'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.google.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/googl'],
      ['google'],
      ['/goog'],
      ['/googless'],
      ['```function("/google", () => {}```'],
      ['/googles'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / google'],
      ['/goo&gle'],
      ['/goo^gle'],
      ['/google!'],
      ['@odin-bot/ google'],
      ['https://google.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.google.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /google query'],
      ["Don't worry about /google query"],
      ['Hey @odin-bot, /google query'],
      ['/@odin-bot ^ /me /google /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.google.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/google'],
      ["it's about/google"],
      ['/googleisanillusion'],
      ['/google/'],
      ['/google*'],
      ['/google...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.google.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(
        commands.google.cb({ content: '/google The Odin Project' })
      ).toMatchSnapshot();
    });
  });
});

describe('/fg', () => {
  describe('regex', () => {
    it.each([
      ['/fg query'],
      [' /fg query'],
      ['/fg query @odin-bot'],
      ['@odin-bot /fg query'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.fg.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/g'],
      ['fg'],
      ['/f'],
      ['```function("/fg", () => {}```'],
      ['/fgs'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / fg'],
      ['/f&g'],
      ['/f^g'],
      ['/fg!'],
      ['@odin-bot/ fg'],
      ['https://fg.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.fg.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /fg query'],
      ["Don't worry about /fg query"],
      ['Hey @odin-bot, /fg query'],
      ['/@odin-bot ^ /me /fg /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.fg.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/fg'],
      ["it's about/fg"],
      ['/fgisanillusion'],
      ['/fg/'],
      ['/fg*'],
      ['/fg...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.fg.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(
        commands.fg.cb({ content: '/fg The Odin Project' })
      ).toMatchSnapshot();
    });
  });
});

describe('/dab', () => {
  describe('regex', () => {
    it.each([['/dab'], [' /dab'], ['/dab @odin-bot'], ['@odin-bot /dab']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.dab.regex.test(string)).toBeTruthy();
      }
    );

    it.each([
      ['/da'],
      ['dab'],
      ['/daa'],
      ['/dabs'],
      ['```function("/dab", () => {}```'],
      ['/d'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / dab'],
      ['/da&b'],
      ['/da^b'],
      ['/dab!'],
      ['@odin-bot/ dab'],
      ['https://dab.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.dab.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /dab'],
      ["Don't worry about /dab"],
      ['Hey @odin-bot, /dab'],
      ['/@odin-bot ^ /me /dab /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.dab.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/dab'],
      ["it's about/dab"],
      ['/dabisanillusion'],
      ['/dab/'],
      ['/dab*'],
      ['/dab...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.dab.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.dab.cb()).toMatchSnapshot();
    });
  });
});

describe('/gandalf', () => {
  describe('regex', () => {
    it.each([
      ['/gandalf'],
      [' /gandalf'],
      ['/gandalf @odin-bot'],
      ['@odin-bot /gandalf'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.gandalf.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/gand'],
      ['gandalf'],
      ['/gandal'],
      ['/gandalfs'],
      ['```function("/gandalf", () => {}```'],
      ['/gandlf'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / gandalf'],
      ['/gan&dalf'],
      ['/gand^alf'],
      ['/gandalf!'],
      ['@odin-bot/ gandalf'],
      ['https://gandalf.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.gandalf.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /gandalf'],
      ["Don't worry about /gandalf"],
      ['Hey @odin-bot, /gandalf'],
      ['/@odin-bot ^ /me /gandalf /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.gandalf.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/gandalf'],
      ["it's about/gandalf"],
      ['/gandalfisanillusion'],
      ['/gandalf/'],
      ['/gandalf*'],
      ['/gandalf...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.gandalf.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.gandalf.cb()).toMatchSnapshot();
    });
  });
});

describe('/motivate', () => {
  describe('regex', () => {
    it.each([
      ['/motivate'],
      [' /motivate'],
      ['/motivate @odin-bot'],
      ['@odin-bot /motivate'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.motivate.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/motivae'],
      ['motivate'],
      ['/motiv'],
      ['/motivates'],
      ['```function("/motivate", () => {}```'],
      ['/motive'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / motivate'],
      ['/motiv&ate'],
      ['/motiva^te'],
      ['/motivate!'],
      ['@odin-bot/ motivate'],
      ['https://motivate.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.motivate.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /motivate'],
      ["Don't worry about /motivate"],
      ['Hey @odin-bot, /motivate'],
      ['/@odin-bot ^ /me /motivate /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.motivate.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/motivate'],
      ["it's about/motivate"],
      ['/motivateisanillusion'],
      ['/motivate/'],
      ['/motivate*'],
      ['/motivate...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.motivate.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.motivate.cb()).toMatchSnapshot();
    });
  });
});

describe('/justdoit', () => {
  describe('regex', () => {
    it.each([
      ['/justdoit'],
      [' /justdoit'],
      ['/justdoit @odin-bot'],
      ['@odin-bot /justdoit'],
    ])('correct strings trigger the callback', (string) => {
      expect(commands.justDoIt.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['/justdoi'],
      ['justdoit'],
      ['/justdo'],
      ['/justdoits'],
      ['```function("/justdoit", () => {}```'],
      ['/d'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / justdoit'],
      ['/just&doit'],
      ['/justdo^it'],
      ['/justDoIt!'],
      ['@odin-bot/ justdoit'],
      ['https://justdoit.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.justDoIt.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /justdoit'],
      ["Don't worry about /justdoit"],
      ['Hey @odin-bot, /justdoit'],
      ['/@odin-bot ^ /me /justdoit /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.justDoIt.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/justdoit'],
      ["it's about/justdoit"],
      ['/dabisanillusion'],
      ['/justdoit/'],
      ['/justdoit*'],
      ['/justdoit...'],
    ])(
      "'%s' - command should be its own word/group - no leading or trailing characters",
      (string) => {
        expect(commands.justDoIt.regex.test(string)).toBeFalsy();
      }
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.justDoIt.cb()).toMatchSnapshot();
    });
  });
});
