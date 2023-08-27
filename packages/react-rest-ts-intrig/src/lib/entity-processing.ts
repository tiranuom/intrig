import { produce } from 'immer';
import { Schema as BaseSchema } from 'jsonschema';

type Schema = BaseSchema & {
  internalDefinitions?: { [name: string]: BaseSchema };
};

export function convertNestedToDefinitions(schema: Schema): Schema {
  return produce(schema, (draft) => {
    draft.internalDefinitions = {};
    convertNestedToDefinitionsHelper(draft, '', draft.internalDefinitions);
  });
}

function convertNestedToDefinitionsHelper(
  s: Schema,
  key: string,
  internalDefinitions: { [name: string]: BaseSchema }
): void {
  if (Array.isArray(s.type)) {
    return;
  }

  if (s.type === 'object' && s.properties) {
    for (const propKey in s.properties) {
      const prop = s.properties[propKey];
      if (
        prop.type === 'object' ||
        (Array.isArray(prop.type) && prop.type.includes('object'))
      ) {
        internalDefinitions[propKey] = prop;
        s.properties[propKey] = { $ref: `#/internalDefinitions/${propKey}` };
      }
      if (prop.type === 'array') {
        convertNestedToDefinitionsWithArray(prop, propKey, internalDefinitions);
      }
      convertNestedToDefinitionsHelper(prop, propKey, internalDefinitions);
    }
  }
}

function convertNestedToDefinitionsWithArray(
  s: Schema,
  key: string,
  internalDefinitions: { [name: string]: BaseSchema }
): void {
  if (Array.isArray(s.items)) {
    s.items.forEach((item, index) => {
      if (item.type === 'object' || item.type === 'array') {
        const definitionKey = `${key}_item_${index}`;
        internalDefinitions[definitionKey] = item;
        s.items[index] = { $ref: `#/internalDefinitions/${definitionKey}` };
      }
      convertNestedToDefinitionsHelper(
        item,
        `${key}_item_${index}`,
        internalDefinitions
      );
    });
  } else {
    if (s.items && (s.items.type === 'object' || s.items.type === 'array')) {
      const definitionKey = `${key}_item`;
      internalDefinitions[definitionKey] = s.items;
      s.items = { $ref: `#/internalDefinitions/${definitionKey}` };
    }
    if (s.items) {
      convertNestedToDefinitionsHelper(
        s.items,
        `${key}_item`,
        internalDefinitions
      );
    }
  }
}
