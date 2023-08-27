import { convertNestedToDefinitions } from './entity-processing';
import { Schema } from 'jsonschema';

describe('convertNestedToDefinitions function', () => {
  it('Should handle schema without nested objects or arrays', () => {
    const schema: Schema = {
      id: '/SimplePerson',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'integer',
        },
        city: {
          type: 'string',
        },
      },
      required: ['name'],
    };

    const result = convertNestedToDefinitions(schema);
    expect(result).toEqual({ ...schema, internalDefinitions: {} });
  });

  it('Should convert nested objects to internalDefinitions', () => {
    const schema: Schema = {
      id: '/NestedPerson',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'integer',
        },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
          },
        },
      },
      required: ['name'],
    };

    const result = convertNestedToDefinitions(schema);

    expect(result).toEqual({
      ...schema,
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        address: {
          $ref: '#/internalDefinitions/address',
        },
      },
      internalDefinitions: {
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
          },
        },
      },
    });
  });

  it('Should convert nested arrays to internalDefinitions', () => {
    const schema: Schema = {
      id: '/NestedPerson',
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'integer',
        },
        hobbies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              duration: { type: 'integer' },
            },
          },
        },
      },
      required: ['name'],
    };

    const result = convertNestedToDefinitions(schema);

    expect(result).toEqual({
      ...schema,
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
        hobbies: {
          items: {
            $ref: '#/internalDefinitions/hobbies_item',
          },
          type: 'array',
        },
      },
      internalDefinitions: {
        hobbies_item: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            duration: { type: 'integer' },
          },
        },
      },
    });
  });
});
