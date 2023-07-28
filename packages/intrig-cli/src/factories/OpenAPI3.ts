import inquirer from "inquirer";

export async function create(name: string, argv: any) {
  let sourceType = argv.sourceType as string;
  let url, file;

  if (!sourceType || !["file", "url"].includes(sourceType)) {
    if (sourceType) {
      console.log(`Invalid value provided for the 'sourceType' option: ${sourceType}`);
    }
    const responses: any = await inquirer.prompt([{
      type: 'list',
      name: 'sourceType',
      message: 'What type of source for OpenAPI2?',
      choices: ['file', 'url'],
    }]);
    sourceType = responses.sourceType;
  }

  if (sourceType === 'url') {
    url = argv.url;
    if (!url) {
      const responses: any = await inquirer.prompt([{
        type: 'input',
        name: 'url',
        message: 'What is the source URL?',
      }]);
      url = responses.url;
    }
  } else if (sourceType === 'file') {
    file = argv.file;
    if (!file) {
      const responses: any = await inquirer.prompt([{
        type: 'input',
        name: 'file',
        message: 'What is the filepath to the source?',
      }]);
      file = responses.file;
    }
  }

  return {name: name, type: 'openApi2', sourceType: sourceType, url: url, file: file};
}
