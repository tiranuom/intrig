import * as Handlebars from 'handlebars';
import {Schema} from "jsonschema";
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const interfaceTemplate = Handlebars.compile(`
/**
{{#if description}}
 * {{description}}
 {{/if}}
 * @createdDate {{createdDate}}
 */
export interface {{interfaceName}} {
    {{#each properties}}
    {{#if this.description}}
    /** {{this.description}} */
    {{/if}}
    {{this.name}}: {{this.type}};
    {{/each}}
}
`);

const typeMapping = new Map([
  ['string', 'string'],
  ['number', 'number'],
  ['integer', 'number'],
  ['boolean', 'boolean']
]);

export function generateInterfaces(schema: Schema, name: string): string {
  let refImports = new Set<string>();
  let nestedInterfaces: { schema: Schema, name: string }[] = [];

  const properties = Object.entries(schema.properties || {}).map(([propertyName, propertyType]) => {
    let type, required = '';
    if (schema.required && (schema.required as string[]).includes(propertyName)) {
      required = '?';
    }
    if (propertyType.$ref) {
      type = propertyType.$ref.split('/').pop();
      if (type) {
        refImports.add(type);
      }
    } else if (propertyType.type === 'object' && propertyType.properties) {
      type = name + capitalize(propertyName);
      nestedInterfaces.push({schema: propertyType, name: type});
    } else if (propertyType.type === "array" && propertyType.items) {
      type = getTSType(propertyType.items as Schema) + '[]';
    } else {
      type = typeMapping.get(propertyType.type as string) || 'any';
    }
    let description = propertyType.description || '';
    return { name: propertyName + required, type, description };
  });

  let description = schema.description || '';
  let createdDate = new Date().toISOString().split('T')[0]; // Get date string as 'yyyy-mm-dd'

  let interfaceResult = interfaceTemplate({interfaceName: name, properties, description, createdDate});

  for (const { schema, name } of nestedInterfaces) {
    interfaceResult += '\n' + generateInterfaces(schema, name);
  }

  if (refImports.size > 0) {
    let imports = '';
    for (let refImport of refImports) {
      imports += `import { ${refImport} } from './${kebabCase(refImport)}';\n`
    }
    interfaceResult = imports + interfaceResult;
  }

  return interfaceResult.trim();
}

function getTSType(property: Schema): string {
  if (property.type === "object" && property.properties) {
    return property.title || "any";
  } else {
    return typeMapping.get(property.type as string) || 'any';
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function kebabCase(str: string): string {
  return str
    .replace(/^([A-Z])/, match => match.toLowerCase()) // Lower case first character
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Insert hyphen before capitalized character
    .toLowerCase(); // Ensure everything is lowercase
}

const writeFileAsync = promisify(fs.writeFile);

type SchemaRecord = Record<string, Schema>;

export async function generateAndSaveInterfaces(schemas: SchemaRecord, dir: string): Promise<void[]> {
  return Promise.all(Object.entries(schemas).map(async ([name, schema]) => {
    const interfaceStr = generateInterfaces(schema, name);
    const interfaceFileName = path.join(dir, `${kebabCase(name)}.ts`);
    await writeFileAsync(interfaceFileName, interfaceStr);
    console.log(`Interface for ${name} has been saved to ${interfaceFileName}`);
  }));
}
