const handlebars = require('handlebars');

describe('generateTypescriptInterfaces', () => {
  it('should generate correct interfaces', () => {
    handlebars.registerHelper('if_eq', function (a, b, opts) {
      if (a === b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });

    const schema = {
      someObject: {
        internalDefinitions: {
          SomeDefinition: {
            properties: {
              prop1: { type: 'string' },
              prop2: { type: 'number' },
            },
          },
        },
        type: 'object',
        properties: {
          prop3: { type: 'string' },
          prop4: { type: 'boolean' },
        },
      },
    };

    const template = `
      {{#each this as |value key|}}
        {{#if value.internalDefinitions}}
          {{#each value.internalDefinitions as |defValue defKey|}}
            export interface {{defKey}} {
              {{#each defValue.properties as |propValue propKey|}}
                {{propKey}}: {{propValue.type}};
              {{/each}}
            }
          {{/each}}
        {{/if}}
        {{#if_eq value.type 'object'}}
          export interface {{key}} {
            {{#each value.properties as |propValue propKey|}}
              {{propKey}}: {{propValue.type}};
            {{/each}}
          }
        {{/if_eq}}
      {{/each}}
    `;

    const compiledTemplate = handlebars.compile(template.trim());
    const result = compiledTemplate(schema).trim();

    const expectedOutput = `
      export interface SomeDefinition {
        prop1: string;
        prop2: number;
      }
      export interface someObject {
        prop3: string;
        prop4: boolean;
      }
    `;

    // Replace multiple white-spaces (including line breaks) with a single space for easier comparison
    expect(result.replace(/\s+/g, ' ')).toEqual(
      expectedOutput.trim().replace(/\s+/g, ' ')
    );
  });
});
