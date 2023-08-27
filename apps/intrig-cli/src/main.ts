#!/usr/bin/env node
import yargs from 'yargs';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { create as openApi2Factory } from './factories/OpenAPI2';
import { create as openApi3Factory } from './factories/OpenAPI3';
import { generateBoilerplateFromSources } from './generator';
import { Config } from '@tiranuom/intrig-common';

const sourceTypes: Record<string, (name: string, argv: any) => Promise<any>> = {
  openApi2: openApi2Factory,
  openApi3: openApi3Factory,
};

const validTypes = ['react', 'angular', 'vue'];
const configPath = path.join(process.cwd(), 'intrig.config.json');

yargs
  .scriptName('intrig')
  .command(
    'init',
    'Creates intrig.config.json file',
    (yargs) =>
      yargs
        .option('type', {
          type: 'string',
          description: 'Project type',
          choices: validTypes,
        })
        .option('lang', {
          type: 'string',
          description: 'Language',
          choices: ['ts', 'js', 'dart'],
        }),
    async (argv) => {
      let configType = argv.type as string;
      if (!configType || !validTypes.includes(configType)) {
        if (configType) {
          console.log(
            `Invalid value provided for the 'type' option: ${configType}`
          );
        }
        const responses: any = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'What is your project type?',
            choices: validTypes,
          },
        ]);
        configType = responses.type;
      }

      let language = argv.lang as string;
      if (!language || !['ts', 'js', 'dart'].includes(language)) {
        if (language) {
          console.log(
            `Invalid value provided for the 'lang' option: ${language}`
          );
        }
        const responses: any = await inquirer.prompt([
          {
            type: 'list',
            name: 'lang',
            message: 'What is your programming language?',
            choices: ['ts', 'js', 'dart'],
          },
        ]);
        language = responses.lang;
      }

      const config: Config = {
        version: '1.0.0',
        type: configType,
        lang: language,
        sources: [],
      };

      await fs.promises.writeFile(
        configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
    }
  )
  .command(
    'add',
    'Adds a new source to sources array',
    (yargs) =>
      yargs.option('sourceType', {
        type: 'string',
        description: 'Source type to add',
        choices: Object.keys(sourceTypes),
      }),
    async (argv) => {
      const configData = await fs.promises.readFile(configPath, {
        encoding: 'utf-8',
      });
      const config: Config = JSON.parse(configData);

      let sourceTypeName = argv.sourceType as string;
      if (
        !sourceTypeName ||
        !Object.keys(sourceTypes).includes(sourceTypeName)
      ) {
        if (sourceTypeName) {
          console.log(
            `Invalid value provided for the 'sourceType' option: ${sourceTypeName}`
          );
        }
        const responses: any = await inquirer.prompt([
          {
            type: 'list',
            name: 'sourceType',
            message: 'What type of source would you like to add?',
            choices: Object.keys(sourceTypes),
          },
        ]);
        sourceTypeName = responses.sourceType;
      }

      // Invoke the selected source type
      const newSource = await sourceTypes[sourceTypeName]('Some Name', argv);

      // Push the new source into the config
      config.sources.push(newSource);

      await fs.promises.writeFile(
        configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
      console.log('Source has been added');
    }
  )
  .command(
    'remove',
    'Removes a source from sources array',
    (yargs) =>
      yargs.option('name', {
        type: 'string',
        description: 'Name of the source to remove',
      }),
    async (argv) => {
      const configData = await fs.promises.readFile(configPath, {
        encoding: 'utf-8',
      });
      const config: Config = JSON.parse(configData);

      let sourceName = argv.name as string;
      if (
        !sourceName ||
        !config.sources.map((s) => s.name).includes(sourceName)
      ) {
        if (sourceName) {
          console.log(
            `Invalid value provided for the 'name' option: ${sourceName}`
          );
        }
        const responses: any = await inquirer.prompt([
          {
            type: 'list',
            name: 'name',
            message: 'Which source would you like to remove?',
            choices: config.sources.map((s) => s.name),
          },
        ]);
        sourceName = responses.name;
      }

      // Remove the source from the list
      config.sources = config.sources.filter((s) => s.name !== sourceName);

      await fs.promises.writeFile(
        configPath,
        JSON.stringify(config, null, 2),
        'utf-8'
      );
      console.log('Source has been removed');
    }
  )
  .command(
    'generate',
    'Generates the code based on configuration',
    {},
    async () => {
      const spinner = ora('Generating...').start();

      try {
        // Read the configuration from the file
        const configData = await fs.promises.readFile(configPath, {
          encoding: 'utf-8',
        });
        const config: Config = JSON.parse(configData);

        // Pass the sources to your function
        await generateBoilerplateFromSources(config);

        spinner.succeed('Generation completed!');
      } catch (error) {
        spinner.fail('Generation failed');
        console.error(error);
      }
    }
  ).argv;
