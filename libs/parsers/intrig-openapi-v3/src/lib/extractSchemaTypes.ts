import { Schema } from 'jsonschema';

function isOpenApiV3Document(object: any): boolean {
  return (
    object &&
    object.hasOwnProperty('openapi') &&
    object.openapi.startsWith('3.') &&
    object.hasOwnProperty('info') &&
    object.hasOwnProperty('paths')
  );
}

export function toCamelCase(str: string) {
  return str.replace(/([-_][a-z0-9])/gi, ($1) => {
    return $1.toUpperCase().replace(/[-_]/g, '');
  });
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function extractSchemaTypes(openApiDoc: any): { [key: string]: Schema } {
  if (!isOpenApiV3Document(openApiDoc)) {
    throw new Error('Not a valid OpenAPI v3 document');
  }
  let schemas = { ...openApiDoc.components?.schemas };

  for (const path in openApiDoc.paths) {
    const cleanPath = toCamelCase(path.replace(/\//g, '_'));
    for (const method in openApiDoc.paths[path]) {
      const operationObj = openApiDoc.paths[path][method];

      for (const response in operationObj.responses) {
        if (operationObj.responses[response].content) {
          for (const mediaType in operationObj.responses[response].content) {
            const schema =
              operationObj.responses[response].content[mediaType].schema;
            if (schema) {
              const schemaName = capitalizeFirstLetter(
                toCamelCase(`${cleanPath}_${method}_${response}`)
              );
              schemas[schemaName] = schema;
            }
          }
        }
      }

      if (operationObj.requestBody && operationObj.requestBody.content) {
        for (const mediaType in operationObj.requestBody.content) {
          const schema = operationObj.requestBody.content[mediaType].schema;
          if (schema) {
            const schemaName = capitalizeFirstLetter(
              toCamelCase(`${cleanPath}_${method}_requestBody`)
            );
            schemas[schemaName] = schema;
          }
        }
      }

      (operationObj.parameters || []).forEach((param: any, index: number) => {
        if (param.schema) {
          const schemaName = capitalizeFirstLetter(
            toCamelCase(`${cleanPath}_${method}_param_${index}`)
          );
          schemas[schemaName] = param.schema;
        }
      });
    }
  }

  return schemas;
}
