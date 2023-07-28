import {RestAPI, Config} from "../../intrig-common/src/main";

interface Template {
  lang: string;
  type: string;
}

interface Source {
  name: string;
  type: string;
  sourceType: string;
  url?: string;
  file?: string;
}

/**
 * Main function to generate boilerplate code from provided source according to the specified template
 *
 * @param inputData JSON object that conforms to defined schema
 * @returns Promise<void>
 */
export async function generateBoilerplateFromSources(inputData: Config): Promise<void> {
  const template: Template = {
    lang: inputData.lang,
    type: inputData.type
  };

  if (!isValidTemplate(template)) {
    console.log('Invalid template type');
    return;
  }

  const sources: Source[] = inputData.sources;
  for (let source of sources) {
    try {
      const parsedSchema = await loadSchema(source);
      if (!parsedSchema) {
        console.log('Failed to load schema');
        continue;
      }

      generateBoilerplate(template, parsedSchema);
    } catch (error) {
      console.log('Error processing source:', error);
    }
  }
}


/**
 * Function to validate template configuration
 *
 * @param template Selected template with specified lang and type
 * @returns True if template is valid, false otherwise
 */
function isValidTemplate(template: Template): boolean {
  return true;
}


/**
 * Function to load and parse API schema from provided source
 *
 * @param source API source to fetch schema from
 * @returns Parsed schema ready for boilerplate generation
 */
async function loadSchema(source: Source): Promise<RestAPI> {
  try {
    const libraryName = `intrig-${source.type}`;
    const schemaLibrary = await import(libraryName);
    return await schemaLibrary.load(source);
  } catch (error) {
    console.log(`Error when loading the library: ${error.message}`);
    return null;
  }
}


/**
 * Function to generate boilerplate code from parsed schema according to provided template
 *
 * @param template Template configuration with specified lang and type
 * @param parsedSchema Parsed API schema from source
 * @returns void
 */
async function generateBoilerplate(template: Template, parsedSchema: RestAPI) {
  try {
    const libraryName = `${template.type}-${template.lang}-intrig`;
    const boilerplateLibrary: any = await import(libraryName);

    // Let's assume the library has a generate() function
    await boilerplateLibrary.generate(template, parsedSchema);
  } catch (error) {
    console.log(`Error when loading or using the boilerplate library: ${error.message}`);
  }
}
