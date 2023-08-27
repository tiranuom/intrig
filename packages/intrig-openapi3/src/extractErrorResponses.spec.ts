import {extractErrorResponses} from './extractEndpoints'

describe('extractErrorResponses', () => {
    it('should handle operations with 4xx and 5xx responses', () => {
        const operation = {
            responses: {
                '404': {
                    description: 'Not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/errorSchema'
                            }
                        }
                    }
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        };

        const path = 'test-path';
        const method = 'delete';

        const result = extractErrorResponses(operation, path, method);

        const expected = [
            {
                type: 'ErrorSchema',
                responseType: 'ErrorResponse',
                description: 'Not found',
                encoding: 'application/json',
                status: '404'
            },
            {
                type: 'TestPathDeleteErrorResponse500',
                responseType: 'ErrorResponse',
                description: 'Internal server error',
                encoding: 'application/json',
                status: '500'
            }
        ];

        expect(result).toEqual(expected);
    });

    it('should return null when operation does not have any 4xx or 5xx response', () => {
        const operation = {
            responses: {
                '200': {
                    description: 'OK'
                },
                '300': {
                    description: 'Multiple Choices'
                }
            }
        };
        const path = 'test-path';
        const method = 'get';

        const result = extractErrorResponses(operation, path, method);

        expect(result).toBeNull();
    });

    it('should correctly convert path and method to Camel Case', () => {
        const operation = {
            responses: {
                '400': {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        };

        const path = 'test-path-with-underscore';
        const method = 'test-method-with-underscore';

        const result = extractErrorResponses(operation, path, method);

        const expected = [
            {
                type: 'TestPathWithUnderscoreTestMethodWithUnderscoreErrorResponse400',
                responseType: 'ErrorResponse',
                description: 'Bad request',
                encoding: 'application/json',
                status: '400'
            }
        ];

        expect(result).toEqual(expected);
    });

    it('should handle 4xx and 5xx responses without content', () => {
        const operation = {
            responses: {
                '401': {
                    description: 'Unauthorized'
                }
            }
        };
        const path = 'test-path';
        const method = 'post';

        const result = extractErrorResponses(operation, path, method);

        expect(result).toBeNull();
    });

    it('should handle 4xx and 5xx responses with content but without schema', () => {
        const operation = {
            responses: {
                '500': {
                    description: 'Server error',
                    content: {
                        'application/json': {}
                    }
                }
            }
        };
        const path = 'test-path';
        const method = 'put';

        const result = extractErrorResponses(operation, path, method);

        expect(result).toEqual([{"description": "Server error", "encoding": "application/json", "responseType": "ErrorResponse", "status": "500", "type": "TestPathPutErrorResponse500"}]);
    });
});
