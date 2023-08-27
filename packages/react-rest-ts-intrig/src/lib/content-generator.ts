import * as handlebars from 'handlebars';
import { registerHelpers } from './util';

registerHelpers(handlebars);

export function generateContent(schema: any, template: string) {
  const compiledTemplate = handlebars.compile(template.trim());
  return compiledTemplate(schema).trim();
}
