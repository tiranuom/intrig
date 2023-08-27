import { compile, create } from 'handlebars';
import { registerHelpers } from './util';

describe('Template helpers', () => {
  let handlebars = create();

  registerHelpers(handlebars);

  const context = {
    str: 'my Test String',
    find: 'Test',
    replaceWith: 'Awesome',
    start: 3,
    end: 7,
    url: '/pet/{petId}/value',
  };

  it('camelCase helper', () => {
    const camelCaseTemplate = handlebars.compile(
      '{{camelCase (removeWhitespace str)}}'
    );
    expect(camelCaseTemplate(context)).toBe('myTestString');
  });

  it('snakeCase helper', () => {
    const snakeCaseTemplate = handlebars.compile('{{snakeCase str}}');
    expect(snakeCaseTemplate(context)).toBe('my_test_string');
  });

  it('pascalCase helper', () => {
    const pascalCaseTemplate = handlebars.compile('{{pascalCase str}}');
    expect(pascalCaseTemplate(context)).toBe('MyTestString');
  });

  it('kebabCase helper', () => {
    const kebabCaseTemplate = handlebars.compile('{{kebabCase str}}');
    expect(kebabCaseTemplate(context)).toBe('my-test-string');
  });

  it('toUpperCase helper', () => {
    const toUpperCaseTemplate = handlebars.compile('{{toUpperCase str}}');
    expect(toUpperCaseTemplate(context)).toBe('MY TEST STRING');
  });

  it('toLowerCase helper', () => {
    const toLowerCaseTemplate = handlebars.compile('{{toLowerCase str}}');
    expect(toLowerCaseTemplate(context)).toBe('my test string');
  });

  it('titleCase helper', () => {
    const titleCaseTemplate = handlebars.compile('{{titleCase str}}');
    expect(titleCaseTemplate(context)).toBe('My Test String');
  });

  it('trim helper', () => {
    const trimTemplate = handlebars.compile('{{trim str}}');
    expect(trimTemplate({ str: '  my Test String  ' })).toBe('my Test String');
  });

  it('substring helper', () => {
    const substringTemplate = handlebars.compile('{{substring str start end}}');
    expect(substringTemplate(context)).toBe('Test');
  });

  it('replace helper', () => {
    const replaceTemplate = handlebars.compile(
      '{{replace str find replaceWith}}'
    );
    expect(replaceTemplate(context)).toBe('my Awesome String');
  });

  it('Interpolate url helper', () => {
    const replaceTemplate = handlebars.compile(
      '{{interpolateUrl url "pathVariable"}}'
    );
    expect(replaceTemplate(context)).toBe(
      '/pet/${encodeURIComponent(pathVariables.petId)}/value'
    );
  });
});
