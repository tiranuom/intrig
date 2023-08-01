import {Schema} from "jsonschema";
import {generateInterfaces} from "./generate-types";

describe('generateInterfaces', () => {

  const createdDate = new Date().toISOString().split('T')[0];

  test('handles basic types', () => {
    const schema: Schema = {
      description: "Basic types interface",
      type: "object",
      properties: {
        strProp: {type: "string", description: "A string property"},
        numProp: {type: "number"},
        intProp: {type: "integer"},
        boolProp: {type: "boolean"}
      }
    };
    const expectedOutput = `
/**
 * Basic types interface
 * @createdDate ${createdDate}
 */
export interface MyInterface {
    /** A string property */
    strProp: string;
    numProp: number;
    intProp: number;
    boolProp: boolean;
}`.trim();

    expect(generateInterfaces(schema, "MyInterface").trim()).toEqual(expectedOutput);
  });

  test('handles arrays', () => {
    const schemaArray: Schema = {
      description: "Arrays interface",
      type: "object",
      properties: {
        arrProp: {type: "array", items: {type: "string"}}
      }
    };
    const expectedArrayOutput = `
/**
 * Arrays interface
 * @createdDate ${createdDate}
 */
export interface MyArrayInterface {
    arrProp: string[];
}`.trim();
    expect(generateInterfaces(schemaArray, "MyArrayInterface").trim()).toEqual(expectedArrayOutput);
  });

  test('handles nested objects', () => {
    const schemaNested: Schema = {
      description: "Nested objects interface",
      type: "object",
      properties: {
        nestedProp: {type: "object", properties: { subProp: {type: "string"} } }
      }
    };
    const expectedNestedOutput = `
 /**
 * Nested objects interface
 * @createdDate ${createdDate}
 */
export interface MyNestedInterface {
    nestedProp: MyNestedInterfaceNestedProp;
}

/**
 * @createdDate ${createdDate}
 */
export interface MyNestedInterfaceNestedProp {
    subProp: string;
}`.trim();
    expect(generateInterfaces(schemaNested, "MyNestedInterface").trim()).toEqual(expectedNestedOutput);
  });

  test('handles $ref references', () => {
    const schemaRef: Schema = {
      description: "$Ref references interface",
      type: "object",
      properties: {
        refProp: {$ref: "#/definitions/OtherInterface"}
      }
    };
    const expectedRefOutput = `
import { OtherInterface } from './other-interface';

/**
 * $Ref references interface
 * @createdDate ${createdDate}
 */
export interface MyRefInterface {
    refProp: OtherInterface;
}`.trim();
    expect(generateInterfaces(schemaRef, "MyRefInterface").trim()).toEqual(expectedRefOutput);
  });

});
