import {Schema} from 'jsonschema'
import {collectRefs, resolveDefinitions} from './resolveDefinitions'

describe('Testing Schema Functionality', () => {

    test('collectRefs Function', () => {
        const schema: Schema = {
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
                father: { $ref: '#/definitions/person' }
            },
            definitions: {
                person: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } } }
            }
        };

        const refs = collectRefs(schema);
        expect(refs).toContain('#/definitions/person');
    });

    test('collectRefs with empty JSON Schema', () => {
        const schema: Schema = {};
        const refs = collectRefs(schema);
        expect(refs).toEqual([]);
    });

    test('collectRefs with JSON Schema that has no $ref', () => {
        const schema: Schema = {
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
            }
        };
        const refs = collectRefs(schema);
        expect(refs).toEqual([]);
    });

    test('collectRefs with JSON Schema that has multiple $ref', () => {
        const schema: any = {
            properties: {
                father: { $ref: '#/definitions/person' },
                mother: { $ref: '#/definitions/person' },
            },
            additional: {
                properties: {
                    friend: { $ref: '#/definitions/person' },
                }
            }
        };
        const refs = collectRefs(schema);
        expect(refs).toEqual(['#/definitions/person']);
    });

    test('collectRefs with JSON Schema that has nested $ref', () => {
        const schema: Schema = {
            properties: {
                father: { $ref: '#/definitions/person' },
                mother: {
                    properties: {
                        friend: { $ref: '#/definitions/person' },
                    }
                },
            }
        };
        const refs = collectRefs(schema);
        expect(refs).toEqual(['#/definitions/person']);
    });

    test('resolveDefinitions Function', () => {
        const schema: Schema = {
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' },
                father: { $ref: '#/definitions/person' }
            },
            definitions: {
                person: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } } }
            }
        };

        const collector: { [key: string]: Schema } = {};

        const resolved = resolveDefinitions(schema, schema.definitions, collector);
        expect(resolved).toHaveProperty('person');
        expect(resolved['person']).toEqual( { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } } });
    });

    test('resolveDefinitions with JSON Schema no $ref', () => {
        const schema: Schema = {
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' }
            }
        };
        const definitions: { [key: string]: any; } = {};
        const collector: { [key: string]: any; } = {};
        const resolved = resolveDefinitions(schema, definitions, collector);
        expect(Object.keys(resolved)).toHaveLength(0);
    });
    test('resolveDefinitions with undefined definitions', () => {
        const schema: Schema = {
            properties: {
                person: { $ref: '#/definitions/person' }
            }
        };
        const definitions: { [key: string]: any; } = {};
        const collector: { [key: string]: any; } = {};
        // Test function here and expect an error or appropriately handled output as per your function's error handling
    });
    test('resolveDefinitions with multiple definitions', () => {
        const schema: Schema = {
            properties: {
                personOne: { $ref: '#/definitions/person' },
                personTwo: { $ref: '#/definitions/person' }
            }
        };
        const definitions: { [key: string]: any; } = {
            person: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } } }
        };
        const collector: { [key: string]: any; } = {};
        const resolved = resolveDefinitions(schema, definitions, collector);
        expect(resolved).toHaveProperty('person');
        expect(Object.keys(resolved)).toHaveLength(1);
    });
    test('resolveDefinitions with nested definitions', () => {
        const schema: Schema = {
            properties: {
                person: { $ref: '#/definitions/adult' }
            }
        };
        const definitions: { [key: string]: any; } = {
            adult: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' }, parent: { $ref: '#/definitions/person' } } },
            person: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'integer' } } }
        };
        const collector: { [key: string]: any; } = {};
        const resolved = resolveDefinitions(schema, definitions, collector);
        expect(resolved).toHaveProperty('adult');
        expect(resolved).toHaveProperty('person');
    });
});
