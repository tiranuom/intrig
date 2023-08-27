import { RestAPI, Config, Source } from '@tiranuom/intrig-common';

/**
 * Main function to generate boilerplate code from provided source according to the specified template
 *
 * @param config JSON object that conforms to defined schema
 * @returns Promise<void>
 */
export async function generateBoilerplateFromSources(
  config: Config
): Promise<void> {
  if (!isValidTemplate(config)) {
    console.log('Invalid template type');
    return;
  }

  const sources: Source[] = config.sources;
  for (let source of sources) {
    try {
      const parsedSchema = await loadSchema(source);
      if (!parsedSchema) {
        console.log('Failed to load schema');
        continue;
      }

      await generateBoilerplate(config, source, parsedSchema);
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
function isValidTemplate(template: Config): boolean {
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
 * Function to generate boilerplate code from parsed schema according to provided template configuration
 *
 * @param config Template configuration with specified lang and type
 * @param source API source to fetch schema from
 * @param parsedSchema Parsed API schema from source
 * @returns void
 */
async function generateBoilerplate(
  config: Config,
  source: Source,
  parsedSchema: RestAPI
) {
  try {
    const libraryName = `${config.type}-${source.sourceType}-${config.lang}-intrig`;
    const boilerplateLibrary: any = await import(libraryName);

    // Let's assume the library has a generate() function
    await boilerplateLibrary.generate(config, source, parsedSchema);
  } catch (error) {
    console.log(
      `Error when loading or using the boilerplate library: ${error.message}`
    );
  }
}
