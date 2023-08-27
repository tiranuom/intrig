import { extractRequestBody } from './extractEndpoints'; // path to your file

describe('extractRequestBody', () => {
    it('should extract request body correctly', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/sampleSchema'
                        }
                    },
                    'application/xml': {
                        schema: {
                            type: 'string'
                        }
                    }
                }
            }
        };

        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        const expected = [
            {
                type: 'SampleSchema',
                required: true,
                description: 'Sample request body',
                encoding: 'application/json'
            },
            {
                type: 'TestPathPostRequestBody',
                required: true,
                description: 'Sample request body',
                encoding: 'application/xml'
            }
        ];

        expect(result).toEqual(expected);
    });

    it('should return null when operation does not have request body', () => {
        const operation = {};
        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        expect(result).toBeNull();
    });

    it('should properly handle operations with multiple request body content types', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/sampleSchema'
                        }
                    },
                    'application/xml': {
                        schema: {
                            type: 'string'
                        }
                    },
                    'text/plain': {
                        schema: {
                            type: 'string'
                        }
                    }
                }
            }
        };

        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        const expected = [
            {
                type: 'SampleSchema',
                required: true,
                description: 'Sample request body',
                encoding: 'application/json'
            },
            {
                type: 'TestPathPostRequestBody',
                required: true,
                description: 'Sample request body',
                encoding: 'application/xml'
            },
            {
                type: 'TestPathPostRequestBody',
                required: true,
                description: 'Sample request body',
                encoding: 'text/plain'
            }
        ];

        expect(result).toEqual(expected);
    });
    it('should handle an empty request body', () => {
        const operation = {
            requestBody: {}
        };
        const path = 'another-path';
        const method = 'get';

        const result = extractRequestBody(operation, path, method);

        expect(result).toBeNull();
    });
    it('should handle missing `required` field in requestBody', () => {
        const operation = {
            requestBody: {
                description: 'Sample request body',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/sampleSchema'
                        }
                    }
                }
            }
        };
        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        const expected = [{
            type: 'SampleSchema',
            required: undefined, // expected `required` field to be `undefined`
            description: 'Sample request body',
            encoding: 'application/json'
        }];

        expect(result).toEqual(expected);
    });
    it('should handle missing `description` field in requestBody', () => {
        const operation = {
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/sampleSchema'
                        }
                    }
                }
            }
        };
        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        const expected = [{
            type: 'SampleSchema',
            required: true,
            description: undefined, // expected `description` field to be `undefined`
            encoding: 'application/json'
        }];

        expect(result).toEqual(expected);
    });
    it('should handle requestBody without `content`', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body'
            }
        };
        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        expect(result).toBeNull();
    });
    it('should handle `content` without `schema` in requestBody', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body',
                content: {
                    'application/json': {}
                }
            }
        };
        const path = 'test-path';
        const method = 'post';

        const result = extractRequestBody(operation, path, method);

        expect(result).toEqual([{"description": "Sample request body", "encoding": "application/json", "required": true, "type": "TestPathPostRequestBody"}]);
    });
    it('should handle unsupported requestBody content-type', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body',
                content: {
                    'unsupported/content-type': {
                        schema: {
                            $ref: '#/components/schemas/sampleSchema'
                        }
                    }
                }
            }
        };
        const path = 'unsupported-path';
        const method = 'unsupported-method';

        const result = extractRequestBody(operation, path, method);

        const expected = [{
            type: 'SampleSchema',
            required: true,
            description: 'Sample request body',
            encoding: 'unsupported/content-type'
        }];

        expect(result).toEqual(expected);
    });
    it('should correctly convert path and method to camelCase', () => {
        const operation = {
            requestBody: {
                required: true,
                description: 'Sample request body',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string'
                        }
                    }
                }
            }
        };
        const path = 'test-path_with_underscore';
        const method = 'test-method_with_underscore';

        const result = extractRequestBody(operation, path, method);

        const expected = [{
            type: 'TestPathWithUnderscoreTestMethodWithUnderscoreRequestBody',
            required: true,
            description: 'Sample request body',
            encoding: 'application/json'
        }];

        expect(result).toEqual(expected);
    });
});
