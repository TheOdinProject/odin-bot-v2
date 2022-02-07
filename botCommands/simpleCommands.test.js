const commands = require('./simpleCommands');

describe('/hug', () => {
  describe('regex', () => {
    it.each([['/hug'], [' /hug'], ['/hug @odin-bot'], ['@odin-bot /hug']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.hug.regex.test(string)).toBeTruthy();
      },
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
      },
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
      ['/smarta'],
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
      },
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
      ['/lennya'],
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
      },
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
      },
    );

    it.each([
      ['/f'],
      ['fu'],
      ['/fuu'],
      ['/fus'],
      ['```function("/fu", () => {}```'],
      ['/fua'],
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
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      const fu = jest.fn(
        () => 'http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif',
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
      ['/questiona'],
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
      },
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
      },
    );

    it.each([
      ['/dat'],
      ['data'],
      ['/daa'],
      ['/datas'],
      ['```function("/data", () => {}```'],
      ['/dataa'],
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
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.data.cb()).toMatchSnapshot();
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
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(
        commands.google.cb({ content: '/google The Odin Project' }),
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
      },
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
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.dab.cb()).toMatchSnapshot();
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
      },
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
      },
    );
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.justDoIt.cb()).toMatchSnapshot();
    });
  });
});

describe('/xy', () => {
  describe('regex', () => {
    it.each([['/xy'], [' /xy'], ['/xy @odin-bot'], ['@odin-bot /xy']])(
      'correct strings trigger the callback',
      (string) => {
        expect(commands.xy.regex.test(string)).toBeTruthy();
      },
    );

    it.each([
      ['/yx'],
      ['xy'],
      ['/x'],
      ['/xs'],
      ['```function("/xy", () => {}```'],
      ['/d'],
      [''],
      [' '],
      [' /'],
      ['@odin-bot / xy'],
      ['/x&y'],
      ['/x^y'],
      ['/xy!'],
      ['@odin-bot/ xy'],
      ['https://xy.com'],
    ])("'%s' does not trigger the callback", (string) => {
      expect(commands.xy.regex.test(string)).toBeFalsy();
    });

    it.each([
      ['Check this out! /xy'],
      ["Don't worry about /xy"],
      ['Hey @odin-bot, /xy'],
      ['/@odin-bot ^ /me /xy /tests$*'],
    ])("'%s' - command can be anywhere in the string", (string) => {
      expect(commands.xy.regex.test(string)).toBeTruthy();
    });

    it.each([
      ['@user/xy'],
      ["it's about/xy"],
      ['/xyisanillusion'],
      ['/xy/'],
      ['/xy*'],
      ['/xy...'],
    ])("'%s' - command should be its own word/group - no leading or trailing characters", (string) => {
      expect(commands.xy.regex.test(string)).toBeFalsy();
    });
  });

  describe('callback', () => {
    it('returns correct output', () => {
      expect(commands.xy.cb()).toMatchSnapshot();
    });
  });
});
