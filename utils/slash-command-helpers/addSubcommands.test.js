const { addSubcommands } = require('./addSubcommands');

describe('adding subcommands', () => {
  it('does not call the addSubcommand method when no subcommands are passed', () => {
    const mockAddSubcommand = jest.fn();
    const builder = { addSubcommand: mockAddSubcommand };

    addSubcommands(builder, []);

    expect(mockAddSubcommand).not.toHaveBeenCalled();
  });

  it('calls addSubcommand once for each subcommand passed', () => {
    const mockAddSubcommand = jest.fn();
    const builder = { addSubcommand: mockAddSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockAddSubcommand).toHaveBeenCalledTimes(3);
  });
});

describe('setting names', () => {
  it('calls setName with the passed names', () => {
    const mockSetName = jest.fn(() => ({ setDescription: () => {} }));
    const subcommand = { setName: mockSetName };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockSetName).toHaveBeenCalledWith('Foo');
    expect(mockSetName).toHaveBeenCalledWith('Bar');
    expect(mockSetName).toHaveBeenCalledWith('Baz');
  });

  it('calls setName once for each subcommand', () => {
    const mockSetName = jest.fn(() => ({ setDescription: () => {} }));
    const subcommand = { setName: mockSetName };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockSetName).toHaveBeenCalledTimes(3);
  });
});

describe('setting descriptions', () => {
  it('calls setDescription with the passed descriptions', () => {
    const mockSetDescription = jest.fn();
    const mockSetName = () => ({ setDescription: mockSetDescription });
    const subcommand = { setName: mockSetName };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockSetDescription).toHaveBeenCalledWith('Foos the bar');
    expect(mockSetDescription).toHaveBeenCalledWith('Bars the bar');
    expect(mockSetDescription).toHaveBeenCalledWith('Baz the bar');
  });

  it('calls setDescription once for each subcommand', () => {
    const mockSetDescription = jest.fn();
    const mockSetName = () => ({ setDescription: mockSetDescription });
    const subcommand = { setName: mockSetName };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockSetDescription).toHaveBeenCalledTimes(3);
  });
});

describe('adding user options', () => {
  it('does not call addUserOption when no min value is passed', () => {
    const mockAddUserOption = jest.fn();

    const subcommand = {
      setName: () => ({ setDescription: () => {} }),
      addUserOption: mockAddUserOption,
    };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar' },
      { name: 'Bar', description: 'Bars the bar' },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockAddUserOption).not.toHaveBeenCalled();
  });

  it('calls addUserOption once for each user option requested', () => {
    const mockAddUserOption = jest.fn();

    const subcommand = {
      setName: () => ({ setDescription: () => {} }),
      addUserOption: mockAddUserOption,
    };
    const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

    const builder = { addSubcommand };

    const subcommands = [
      { name: 'Foo', description: 'Foos the bar', min: 2, max: 3 },
      { name: 'Bar', description: 'Bars the bar', min: 3 },
      { name: 'Baz', description: 'Baz the bar' },
    ];

    addSubcommands(builder, subcommands);

    expect(mockAddUserOption).toHaveBeenCalledTimes(6);
  });

  describe('setting names of user options', () => {
    it('sets option names of user0 and user1 when two user options are requested', () => {
      const mockSetName = jest.fn(() => ({
        setDescription: () => ({ setRequired: () => {} }),
      }));
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2, max: 3 },
        { name: 'Bar', description: 'Bars the bar' },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetName).toHaveBeenCalledWith('user0');
      expect(mockSetName).toHaveBeenCalledWith('user1');
      expect(mockSetName).toHaveBeenCalledWith('user2');
    });

    it('calls setName once for each user option requested', () => {
      const mockSetName = jest.fn(() => ({
        setDescription: () => ({ setRequired: () => {} }),
      }));
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2, max: 3 },
        { name: 'Bar', description: 'Bars the bar', min: 1 },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetName).toHaveBeenCalledTimes(4);
    });
  });

  describe('setting descriptions of user options', () => {
    it('calls setDescription on the user options with the associated description', () => {
      const mockSetDescription = jest.fn(() => ({ setRequired: () => {} }));
      const mockSetName = () => ({
        setDescription: mockSetDescription,
      });
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2 },
        { name: 'Bar', description: 'Bars the bar', min: 1 },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetDescription).toHaveBeenCalledWith('Foos the bar');
      expect(mockSetDescription).toHaveBeenCalledWith('Bars the bar');
    });

    it('calls setDescription once for each user option requested', () => {
      const mockSetDescription = jest.fn(() => ({ setRequired: () => {} }));
      const mockSetName = () => ({
        setDescription: mockSetDescription,
      });
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2, max: 3 },
        { name: 'Bar', description: 'Bars the bar', min: 1 },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetDescription).toHaveBeenNthCalledWith(1, 'Foos the bar');
      expect(mockSetDescription).toHaveBeenNthCalledWith(2, 'Foos the bar');
      expect(mockSetDescription).toHaveBeenNthCalledWith(3, 'Foos the bar');
      expect(mockSetDescription).toHaveBeenNthCalledWith(4, 'Bars the bar');
    });
  });

  describe('setting user options as required', () => {
    it('calls setRequired for the minimum user options needed', () => {
      const mockSetRequired = jest.fn();
      const mockSetName = () => ({
        setDescription: () => ({ setRequired: mockSetRequired }),
      });
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2 },
        { name: 'Bar', description: 'Bars the bar', min: 1 },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetRequired).toHaveBeenCalledTimes(3);
    });

    it('does not call setRequired for the maximum user options needed', () => {
      const mockSetRequired = jest.fn();
      const mockSetName = () => ({
        setDescription: () => ({ setRequired: mockSetRequired }),
      });
      const option = {
        setName: mockSetName,
      };
      const mockAddUserOption = (optionCB) => optionCB(option);

      const subcommand = {
        setName: () => ({ setDescription: () => {} }),
        addUserOption: mockAddUserOption,
      };
      const addSubcommand = (subcommandCB) => subcommandCB(subcommand);

      const builder = { addSubcommand };

      const subcommands = [
        { name: 'Foo', description: 'Foos the bar', min: 2, max: 10 },
        { name: 'Bar', description: 'Bars the bar', min: 1 },
        { name: 'Baz', description: 'Baz the bar' },
      ];

      addSubcommands(builder, subcommands);

      expect(mockSetRequired).toHaveBeenCalledTimes(3);
    });
  });
});
