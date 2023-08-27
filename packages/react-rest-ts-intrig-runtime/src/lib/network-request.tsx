export interface NetworkRequestMetadata {
  /**
   * The domain of the source.
   */
  domain: string;
  /**
   * A unique key to identify the request.
   */
  key?: string;
  /**
   * The HTTP method to be used for the request.
   * It can be either 'GET', 'POST', 'PUT', or 'DELETE'.
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  /**
   * The URL where the request should be sent.
   */
  url: string;

  /**
   * An optional record of key-value pairs to represent the
   * HTTP headers to be sent with the request.
   */
  headers?: Record<string, string>;
}

/**
 * `NetworkRequest` represents a network request to be processed.
 * @template T The type of the body payload.
 */
export interface NetworkRequest<T> {
  /**
   * The URL where the request should be sent.
   */
  url: string;

  /**
   * An optional record of key-value pairs to represent the
   * HTTP headers to be sent with the request.
   */
  headers?: Record<string, string>;

  /**
   * An optional object to represent the body of the request, if necessary.
   * Usually required for 'POST' and 'PUT' requests.
   */
  body?: T;

  /**
   * An optional object to represent the query parameters of the request.
   */
  params?: Record<string, any>;
}
