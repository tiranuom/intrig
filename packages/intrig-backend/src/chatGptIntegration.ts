import {OpenAIApi, Configuration} from "openai";
import { config } from "dotenv";
import * as process from "process";

config()
const openai = new OpenAIApi(new Configuration({apiKey: process.env.OPENAI_API_KEY}));
export async function query(prompt: string[]) {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: prompt.map(p => ({
                role: 'user',
                content: p
            })),
            temperature: 0.2
        });

        return response.data; // Return the chat response
    } catch (err) {
        console.error(err);
        throw err; // Throw the error so it can be caught and handled by the caller
    }
}

export interface CodeModificationRequest {
  lang: 'typescript' | 'javascript'
  code: string
  modifications: string
}

export async function modifyIndexContent(request: CodeModificationRequest) {
  console.log("Querying GPT-3 with request: ", request)
  const response = await query([
    `Consider following code
 \`\`\`${request.lang}
${request.code}
\`\`\`
 and I have a higher order component called Intrig in './.intrig/index.js'`,
    `Generate code based on the following input:
Input: ${request.modifications}`,
  ]);
  let pattern = new RegExp(`\`\`\`${request.lang}
([^\`]+)
\`\`\``, "g");
  console.log("Response from GPT-3: ", response)
  let content = response.choices[0].message.content;

  let match = pattern.exec(content);
  if (match) {
    content = match[1];
  }
  console.log("Returning content: ", content)
  return content;
}
