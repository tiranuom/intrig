import {Controller, Endpoint, HttpMethod} from "../../intrig-common/src/main";
import * as path from "path";
import {response} from "express";

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function extractRequestBody(operation: any, path: string, method: string) {
    if (!operation.requestBody) {
        return null;
    }

    let requestBodyDetails = [];
    // Converting path and method to camel case
    const camelCasePath = capitalizeFirstLetter(path.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));
    const camelCaseMethod = capitalizeFirstLetter(method.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));

    for (const contentType in operation.requestBody.content) {
        if (operation.requestBody.content.hasOwnProperty(contentType)) {
            let requestBodyType;
            const schema = operation.requestBody.content[contentType].schema;

            if (schema?.hasOwnProperty('$ref')) {
                requestBodyType = capitalizeFirstLetter(schema['$ref'].split('/').pop());
            } else {
                // If the schema is not a reference, use your schema naming strategy
                requestBodyType = capitalizeFirstLetter(`${camelCasePath}${camelCaseMethod}RequestBody`);
            }

            requestBodyDetails.push({
                type: requestBodyType,
                required: operation.requestBody.required,
                description: operation.requestBody.description,
                encoding: contentType,
            });
        }
    }

    return requestBodyDetails.length > 0 ? requestBodyDetails : null;
}
export function extractResponse(operation: any, path: string, method: string) {
    let successResponse = operation.responses['200'];
    let responseDetails = [];

    if (!successResponse) {
        return null;
    }

    const camelCasePath = capitalizeFirstLetter(path.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));
    const camelCaseMethod = capitalizeFirstLetter(method.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));

    for (const contentType in successResponse.content) {
        if (successResponse.content.hasOwnProperty(contentType)) {
            let responseType;
            const schemaObj = successResponse.content[contentType].schema;

            if (schemaObj && schemaObj.hasOwnProperty('$ref')) {
                responseType = capitalizeFirstLetter(schemaObj['$ref'].split('/').pop());
            } else {
                // If the schema is not a reference, use a schema naming strategy
                responseType = `${camelCasePath}${camelCaseMethod}SuccessResponse`;
            }

            responseDetails.push({
                type: responseType,
                description: successResponse.description,
                encoding: contentType,
            });
        }
    }

    return responseDetails.length > 0 ? responseDetails : null;
}

export function extractErrorResponses(operation: any, path: string, method: string) {
    let errorResponses = [];

    for (const responseCode in operation.responses) {
        if (operation.responses.hasOwnProperty(responseCode) && (responseCode.startsWith('4') || responseCode.startsWith('5'))) {
            const errorResponse = operation.responses[responseCode];

            let camelCasePath = capitalizeFirstLetter(path.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));
            let camelCaseMethod = capitalizeFirstLetter(method.replace(/[-_]([a-z])/g, g => g[1].toUpperCase()));

            for (const contentType in errorResponse.content) {
                if (errorResponse.content.hasOwnProperty(contentType)) {
                    let errorResponseType;

                    const schemaObj = errorResponse.content[contentType].schema;
                    if (schemaObj && schemaObj.hasOwnProperty('$ref')) {
                        errorResponseType = capitalizeFirstLetter(schemaObj['$ref'].split('/').pop());
                    } else {
                        // If the schema is not a reference, use a naming strategy
                        errorResponseType = `${camelCasePath}${camelCaseMethod}ErrorResponse${responseCode}`;
                    }

                    errorResponses.push({
                        type: errorResponseType,
                        responseType: 'ErrorResponse',
                        description: errorResponse.description,
                        encoding: contentType,
                        status: responseCode,
                    });
                }
            }
        }
    }

    return errorResponses.length > 0 ? errorResponses : null;
}

export function extractEndpoints(openApiDoc: any): Endpoint[] {
    let endpoints: Endpoint[] = [];

    // Iterate over all paths
    for (const path in openApiDoc.paths) {
        // let endpoints: Endpoint[] = [];

        // Create an endpoint for each method in the path
        for (const method in openApiDoc.paths[path]) {
            const operation = openApiDoc.paths[path][method];

            let groupedParameters: any = {};

            if (operation.parameters) {
                operation.parameters.forEach((param: any) => {
                    const parameter = {
                        name: param.name,
                        type: param.schema?.type ?? param.schema?.$ref.split('/').pop(),
                        required: param.required,
                        description: param.description,
                    };

                    // Initialize the array if it doesn't exist yet
                    groupedParameters[param.in] = groupedParameters[param.in] || [];
                    groupedParameters[param.in].push(parameter);
                });
            }

            // Extract details using helper functions
            const body: any[] = extractRequestBody(operation, path, method);
            const response: any[] = extractResponse(operation, path, method);
            const errorResponses = extractErrorResponses(operation, path, method);

            endpoints.push({
                controller: path,
                name: operation.operationId || `${method.toUpperCase()} ${path}`,
                method: method.toUpperCase() as HttpMethod,
                path,
                customHeaders: [],
                queryParameters: groupedParameters.query || [],
                pathParameters: groupedParameters.path || [],
                body: body,
                encoding: "",   // Not available from the open API schema
                description: operation.description || '',
                tags: operation.tags || [],
                response: response,
                responseEncoding: "",   // Not available from the open API schema
                errorResponses: errorResponses
            })


        }

        // Add the constructed controller to the controllers array
        // controllers.push({
        //     name: path,
        //     endpoints,
        // });
    }

    return endpoints;
}
