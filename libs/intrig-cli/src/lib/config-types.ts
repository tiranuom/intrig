export interface Dependency {
  name: string;
}

export interface Tool {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        devDependencies?: Dependency[];
        dependencies?: Dependency[];
      };
    };
  };
}

export interface Parser {
  [key: string]: {
    devDependencies?: Dependency[];
  };
}

export interface CliConfigSchema {
  generators: Tool;
  parsers: Parser;
}
