import {CodeModificationRequest, modifyIndexContent, query} from "./chatGptIntegration";

let pattern = /```typescript\n([^`]+)\n```/g;

describe("chatGptIntegration", () => {

    const originalFunction = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
`;
    const modifications = "This is a react index.js. I have a higher order component called Intrig in './.intrig/index.js' I need to wrap <App/> with <Intrig></Intrig>;\n"

    const prompt = originalFunction + "\n" + modifications;

    it("should return a response", async () => {
        const response = await query([
            "Consider following code\n ```typescript" + originalFunction + "``` \n and I have a higher order component called Intrig in './.intrig/index.js'",
            `Generate code based on the following input:
            Input: Import Intrig and wrap <App/> with <Intrig></Intrig>`,
        ]);
        let content = response.choices[0].message.content;

        let match = pattern.exec(content);
        if (match) {
            content = match[1];
        }

        console.log(content);
        expect(response).toBeDefined();
    });

  it('should modify index content for React', async () => {
    const request: CodeModificationRequest = {
      lang: 'javascript',
      code: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
`,
      modifications: "Wrap content with <Intrig></Intrig>"
    };
    const response = await modifyIndexContent(request);
    console.log(response);
    expect(response).toBeDefined();
  })

  it('should modify index content for Angular', async () => {
    const request: CodeModificationRequest = {
      lang: 'typescript',
      code: `
      import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { JsonSchemaFormModule } from '@ajsf/core';
// import {MaterialDesignFrameworkModule} from '@ajsf/material';
import { PostsFormComponent } from './posts-form/posts-form.component'
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    PostsFormComponent
  ],
  imports: [
    BrowserModule,
    JsonSchemaFormModule,
    HttpClientModule
    // MaterialDesignFrameworkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
`,
      modifications: "Import Intrig from './.intrig/index.js' as a module and add it to imports"
      };
    const response = await modifyIndexContent(request);
    console.log(response);
    expect(response).toBeDefined();
  })
})
