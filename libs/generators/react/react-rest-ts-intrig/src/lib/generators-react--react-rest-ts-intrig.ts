import * as fs from 'fs-extra';
import * as path from 'path';
import * as matter from 'gray-matter';
import * as _ from 'lodash';
import * as Handlebars from 'handlebars';
import { registerHelpers } from './util';
import { RestAPI, Source } from '@tiranuom/intrig-common';
let compile = Handlebars.compile;

registerHelpers(Handlebars);

function lastSegment(ref: string): string {
  return ref.split('/').pop();
}

function extractRefs(obj: object): string[] {
  let refs: string[] = [];

  for (let key in obj) {
    if (key === '$ref' && typeof obj[key] === 'string') {
      // Skip if the reference is for internal definitions
      if (!obj[key].startsWith('#/internalDefinitions/')) {
        refs.push(lastSegment(obj[key]));
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      refs = refs.concat(extractRefs(obj[key]));
    }
  }

  return refs;
}

function getUniqueRefs(obj: object): string[] {
  return _.uniq(extractRefs(obj));
}

// Register the getUniqueRefs helper
Handlebars.registerHelper('getUniqueRefs', function (context) {
  return getUniqueRefs(context);
});

const templatesDirectory = path.join(__dirname, '../templates');

interface Metadata {
  filePath: string;
  dataPath: string;
}

function generate(
    rootDirectory: string,
    source: Source,
    jsonData: RestAPI
): void {
  try {
    const files = fs.readdirSync(templatesDirectory);

    files.forEach((file: string) => {
      if (path.extname(file) === '.hbs') {
        const parsedContents = matter.read(path.join(templatesDirectory, file));
        const metadata = parsedContents.data as Metadata;
        let dataObject = _.get(jsonData, metadata.dataPath);

        if (_.isObject(dataObject) && !_.isArray(dataObject)) {
          dataObject = Object.keys(dataObject).map((key) => ({
            ...dataObject[key],
            _key: key,
          }));
        } else if (!_.isArray(dataObject)) {
          throw new Error(
              `The data at ${metadata.dataPath} is not an object or array.`
          );
        }

        const filePathTemplate = compile(metadata.filePath);
        const contentTemplate = compile(parsedContents.content);

        dataObject.map((item: any) => {
          const object = { ...item };
          object.filePath = filePathTemplate(object);
          object.content = contentTemplate(object);

          // Create directory and file for each item
          const finalPath = path.join(rootDirectory, object.filePath);
          fs.mkdirsSync(path.dirname(finalPath));
          fs.writeFileSync(finalPath, object.content);

          return object;
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

export { generate };
