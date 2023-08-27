import { extractResponse } from './extractEndpoints';

describe('extractResponse', () => {
  it('should handle operations with status 200 response', () => {
    const operation = {
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/sampleSchema',
              },
            },
          },
        },
      },
    };

    const path = 'test-path';
    const method = 'get';

    const result = extractResponse(operation, path, method);

    const expected = [
      {
        type: 'SampleSchema',
        description: 'Successful response',
        encoding: 'application/json',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return null when operation does not have status 200 response', () => {
    const operation = {
      responses: {
        '404': {
          description: 'Not found',
        },
      },
    };
    const path = 'test-path';
    const method = 'get';

    const result = extractResponse(operation, path, method);

    expect(result).toBeNull();
  });

  it('should correctly convert path and method to Camel Case', () => {
    const operation = {
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
      },
    };

    const path = 'test-path-with-underscore';
    const method = 'test-method-with-underscore';

    const result = extractResponse(operation, path, method);

    const expected = [
      {
        type: 'TestPathWithUnderscoreTestMethodWithUnderscoreSuccessResponse',
        description: 'Successful response',
        encoding: 'application/json',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle status 200 response without content', () => {
    const operation = {
      responses: {
        '200': {
          description: 'Successful response',
        },
      },
    };
    const path = 'test-path';
    const method = 'get';

    const result = extractResponse(operation, path, method);

    expect(result).toBeNull();
  });

  it('should handle status 200 response with content but without schema', () => {
    const operation = {
      responses: {
        '200': {
          description: 'Successful response',
          content: {
            'application/json': {},
          },
        },
      },
    };
    const path = 'test-path';
    const method = 'get';

    const result = extractResponse(operation, path, method);

    expect(result).toEqual([
      {
        description: 'Successful response',
        encoding: 'application/json',
        type: 'TestPathGetSuccessResponse',
      },
    ]);
  });
});
