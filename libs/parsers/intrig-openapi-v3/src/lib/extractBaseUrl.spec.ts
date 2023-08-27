import { extractBaseUrl } from './extractBaseUrl';

describe('Testing extractBaseUrl function', () => {
  // Case when servers array is not defined
  it('should return an empty string when servers property is not defined', () => {
    const openApiDoc = {};
    expect(extractBaseUrl(openApiDoc)).toEqual('');
  });

  // Case when servers array is empty
  it('should return an empty string when servers array is empty', () => {
    const openApiDoc = { servers: [] };
    expect(extractBaseUrl(openApiDoc)).toEqual('');
  });

  // Case when servers array has at least one server
  it('should return the URL of the first server', () => {
    const openApiDoc = {
      servers: [
        { url: 'http://localhost:3000' },
        { url: 'http://localhost:4000' },
      ],
    };
    expect(extractBaseUrl(openApiDoc)).toEqual('http://localhost:3000');
  });
});
