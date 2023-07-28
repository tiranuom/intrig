import axios from 'axios';
import fs from 'fs';
import { promisify } from 'util';
import { Source, RestAPI } from '../../intrig-common/src/main';
import {extractControllers} from "./extractControllers";
import {extractSchemaTypes} from "./extractSchemaTypes";
import {extractBaseUrl} from "./extractBaseUrl";

// Convert fs.readFile into Promise version to use with async/await
const readFile = promisify(fs.readFile);

export async function load(source: Source): Promise<RestAPI> {
    const data = await loadFileContent(source);
    return {
        name: source.name,
        baseUrl: extractBaseUrl(data),
        controllers: extractControllers(data),
        types: extractSchemaTypes(data)
    };
}

async function loadFileContent(source: Source): Promise<any> {
    if (source.sourceType === 'url') {
        return loadFromUrl(source.url);
    } else if (source.sourceType === 'file') {
        return loadFromFile(source.file);
    } else {
        throw new Error(`Unsupported sourceType ${source.sourceType}`);
    }
}

async function loadFromUrl(url: string | undefined): Promise<any> {
    if (!url) {
        throw new Error('URL is required for sourceType URL');
    }

    const response = await axios.get(url);
    return response.data;
}

async function loadFromFile(file: string | undefined): Promise<any> {
    if (!file) {
        throw new Error('File path is required for sourceType file');
    }

    const data = await readFile(file, 'utf8');
    return JSON.parse(data);
}