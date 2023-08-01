import {Schema} from "jsonschema";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
export type ParamType = 'string' | 'number' | 'boolean' | 'array';

export interface Parameter {
  name: string;
  type: ParamType;
  required: boolean;
  description: string;
}

export interface Body {
  type: string;
  required: boolean;
  description: string;
}

export interface Response {
  type: string;
  description: string;
}

export interface ErrorResponse {
  status: number;
  type: string;
  description: string;
}

export interface Endpoint {
  name: string;
  method: HttpMethod;
  path: string;
  queryParameters: Parameter[];
  pathParameters: Parameter[];
  body: Body[];
  encoding: string;
  description: string;
  tags: string[];
  customHeaders: Parameter[];
  response: Response[];
  responseEncoding: string;
  errorResponses: ErrorResponse[];
}

export interface Controller {
  name: string;
  endpoints: Endpoint[];
}

export interface RestAPI {
  name: string;
  baseUrl: string;
  controllers: Controller[];
  types: { [key:string]: Schema}
}

export interface Source {
  name: string;
  type: string;
  sourceType: 'file' | 'url';
  url?: string;
  file?: string;
}
export interface Config {
  version: string;
  type: string;
  lang: string
  sources: Array<Source>;
}

export interface EndpointContext {
  name: string;
  method: HttpMethod;
  path: string;
  queryParameters: Parameter[];
  pathParameters: Parameter[];
  body: Body;
  encoding: string;
  description: string;
  tags: string[];
  customHeaders: Parameter[];
  response: Response;
  responseEncoding: string;
  errorResponses: ErrorResponse[];
}
