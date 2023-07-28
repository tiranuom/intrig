import { extractSchemaTypes } from './extractSchemaTypes'; // path to your file

let openApiHeader = {
    openapi: '3.0.0',
    info: {
        title: 'Test API',
        version: '1.0.0'
    }
}

describe('extractSchemaTypes', () => {
    it('should properly extract schemas', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: {
                    testSchema: { type: 'string' }
                }
            },
            paths: {
                '/test1': {
                    get: {
                        responses: {
                            '200': {
                                content: {
                                    'application/json': {
                                        schema: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const schemas = extractSchemaTypes(input);

        expect(schemas).toEqual({
            testSchema: { type: 'string' },
            Test1Get200: { type: 'number' }
        });
    });
    it('should properly extract global schemas', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: {
                    someSchema: { type: 'string' },
                    anotherSchema: { type: 'integer' },
                }
            },
            paths: {}
        };

        const schemas = extractSchemaTypes(input);
        expect(schemas).toEqual({
            someSchema: { type: 'string' },
            anotherSchema: { type: 'integer' },
        });
    });
    it('should properly extract schemas from responses', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: {}
            },
            paths: {
                '/test1': {
                    get: {
                        responses: {
                            '200': {
                                content: {
                                    'application/json': {
                                        schema: { type: 'string' }
                                    }
                                }
                            },
                            '404': {
                                content: {
                                    'application/json': {
                                        schema: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                },
                '/test2': {
                    post: {
                        responses: {
                            '201': {
                                content: {
                                    'application/json': {
                                        schema: { type: 'boolean' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const schemas = extractSchemaTypes(input);
        expect(schemas).toEqual({
            Test1Get200: { type: 'string' },
            Test1Get404: { type: 'number' },
            Test2Post201: { type: 'boolean' }
        });
    });
    it('should properly extract schemas from requestBody', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: { }
            },
            paths: {
                '/test': {
                    post: {
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: { type: 'string' }
                                }
                            }
                        }
                    },
                    put: {
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: { type: 'boolean' }
                                }
                            }
                        }
                    }
                }
            }
        };

        const schemas = extractSchemaTypes(input);
        expect(schemas).toEqual({
            TestPostRequestBody: { type: 'string' },
            TestPutRequestBody: { type: 'boolean' }
        });
    });
    it('should properly extract schemas from parameters', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: { }
            },
            paths: {
                '/test': {
                    get: {
                        parameters: [
                            {
                                schema: { type: 'string' },
                            },
                            {
                                schema: {type: 'number' },
                            }
                        ]
                    }
                }
            }
        };

        const schemas = extractSchemaTypes(input);
        expect(schemas).toEqual({
            TestGetParam0: { type: 'string' },
            TestGetParam1: { type: 'number' }
        });
    });
    it('should properly convert schema names to camelCase', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: { }
            },
            paths: {
                '/test-path': {
                    get: {
                        responses: {
                            '200': {
                                content: {
                                    'application/json': {
                                        schema: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        const schemas = extractSchemaTypes(input);
        expect(schemas).toStrictEqual({
            TestPathGet200: { type: 'string' },
        });
    });
    it('should handle empty schemas in responses', () => {
        const input = {
            ...openApiHeader,
            components: {
                schemas: {}
            },
            paths: {
                '/test': {
                    get: {
                        responses: {
                            '200': {
                                content: {
                                    'application/json': {},
                                },
                            },
                        },
                    },
                },
            },
        };

        const schemas = extractSchemaTypes(input);

        expect(schemas).toEqual({});
    });
    it('should handle invalid input', () => {
        const input = 'this is not a valid OpenAPI document';

        expect(() => {
            extractSchemaTypes(input);
        }).toThrow();

        const input2 = {
            notAPath: 'still not a valid OpenAPI document'
        };

        expect(() => {
            const schemas2 = extractSchemaTypes(input2);
        }).toThrow();

        expect(() => {
            extractSchemaTypes(input);
        }).toThrow();
    });
    it('should handle deeply nested OpenAPI documents and large number of paths', () => {
        const paths = {};
        for(let i = 0; i < 1000; i++) {
            paths[`/path${i}`] = {
                get: {
                    responses: {
                        '200': {
                            content: {
                                'application/json': {
                                    schema: { type: 'string' }
                                }
                            }
                        }
                    },
                    parameters: [
                        { schema: { type: 'integer'}},
                        { schema: { type: 'boolean'}}
                    ],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { type: 'array'}
                            }
                        }
                    }
                }
            };
        }

        const input = {
            ...openApiHeader,
            components: {
                schemas: {}
            },
            paths
        };

        const schemas = extractSchemaTypes(input);

        for(let i=0; i<1000; i++) {
            expect(schemas).toHaveProperty(`Path${i}Get200`, { type: 'string' });
            expect(schemas).toHaveProperty(`Path${i}GetRequestBody`, { type: 'array' });
            expect(schemas).toHaveProperty(`Path${i}GetParam0`, { type: 'integer' });
            expect(schemas).toHaveProperty(`Path${i}GetParam1`, { type: 'boolean' });
        }
    });
});
