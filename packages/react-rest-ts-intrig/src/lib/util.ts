import { registerHelper } from 'handlebars';

export function registerHelpers(handlebars: any) {
  // A helper to remove all whitespaces from a string
  // Usage: {{removeWhitespace myString}}
  handlebars.registerHelper('removeWhitespace', function (str: string): string {
    return str.replace(/\s/g, '');
  });

  // Convert a string to snake case
  // Usage: {{snakeCase myString}}
  handlebars.registerHelper('snakeCase', function (str: string): string {
    return str.replace(
      /[\s-]+([a-zA-Z])/g,
      (match, letter) => `_${letter.toLowerCase()}`
    );
  });

  // Convert a string to camel case
  // Usage: {{camelCase myString}}
  handlebars.registerHelper('camelCase', function (str: string): string {
    const camelCase = str.replace(/-([^-])/g, (g) => g[1].toUpperCase());
    return camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
  });

  // Convert a string to pascal case
  // Usage: {{pascalCase myString}}
  handlebars.registerHelper('pascalCase', function (str: string): string {
    return str
      .match(/[a-z]+/gi)
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      })
      .join('');
  });
  // A Handlebars helper to convert strings to kebab-case
  // Usage: {{kebabCase myString}}
  handlebars.registerHelper('kebabCase', function (str: string): string {
    // Replace spaces and uppercase letters (preceded by a space or start of string) with a hyphen followed by the lowercase version of the letter
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : '-' + word.toLowerCase();
      })
      .replace(/\s+/g, '');
  });

  // Convert a string to upper case
  // Usage: {{toUpperCase myString}}
  handlebars.registerHelper('toUpperCase', function (str: string): string {
    return str.toUpperCase();
  });

  // Transform a string to lower case
  // Usage: {{toLowerCase myString}}
  handlebars.registerHelper('toLowerCase', function (str: string): string {
    return str.toLowerCase();
  });

  // Transform a string to title case
  // Usage: {{titleCase myString}}
  handlebars.registerHelper('titleCase', function (str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  });

  // Remove white spaces around a string
  // Usage: {{trim myString}}
  handlebars.registerHelper('trim', function (str: string): string {
    return str.trim();
  });

  // Extract a substring from a string
  // Usage: {{substring myString start end}}
  handlebars.registerHelper(
    'substring',
    function (str: string, start: number, end: number): string {
      return str.substring(start, end);
    }
  );

  // Replace occurrences of a substring
  // Usage: {{replace myString find replaceWith}}
  handlebars.registerHelper(
    'replace',
    function (str: string, find: string, replaceWith: string): string {
      return str.replace(new RegExp(find, 'g'), replaceWith);
    }
  );

  handlebars.registerHelper(
    'interpolateUrl',
    function (path: string, context: any): string {
      return path.replace(/\{([\w.]+)\}/g, function (match, captured) {
        return `\${encodeURIComponent(pathVariables.${captured})}`;
      });
    }
  );

  handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a === b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  handlebars.registerHelper('ternary', function (condition, value1, value2) {
    return condition ? value1 : value2;
  });

  handlebars.registerHelper('lastSegment', function (value) {
    return value.split('/').pop();
  });
}
