import {Schema} from "jsonschema";

export function collectRefs(schema: Schema, path: string = ''): string[] {
    let refs: string[] = [];

    if (schema.hasOwnProperty('$ref')) {
        let refPath = schema['$ref'];
        let entityName = refPath.split('/').pop();
        refs.push(entityName);
        schema['$ref'] = `/definitions/${entityName}`;
    }

    if (schema.hasOwnProperty('properties')) {
        Object.keys(schema['properties']).forEach((propertyKey) => {
            const propertyValue = schema['properties'][propertyKey];
            if (typeof propertyValue === "object" && propertyValue !== null) {
                refs = refs.concat(collectRefs(propertyValue, `${path}/${propertyKey}`));
            }
        });
    }

    if (schema.hasOwnProperty('items')) {
        // Assume items to be an object
        if (typeof schema['items'] === "object" && schema['items'] !== null) {
            refs = refs.concat(collectRefs(schema['items'] as Schema, `${path}/items`));
        }
    }

    return [...new Set(refs)];
}
export function resolveDefinitions(schema: Schema, definitions: { [key: string]: Schema }, collector: { [key: string]: Schema } = {}) {
    let refs = collectRefs(schema)
        .reduce((acc: {[k: string]: Schema}, cur) => {
            acc[cur] = definitions[cur];
            return acc;
        }, {});
    Object.keys(refs).forEach(key => {
        collector[key] = refs[key];
        resolveDefinitions(refs[key], definitions, collector);
    })
    return collector;
}

export function updateDefinitions(map: {[k: string]: Schema}) {
    Object.values(map).forEach(schema => {
        schema.definitions = resolveDefinitions(schema, map)
    })
}
