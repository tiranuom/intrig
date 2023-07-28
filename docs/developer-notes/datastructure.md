# Data Structure Requirement

## Parameter Description.

| Name              | Description                  | Provided By    | Direction | 
|-------------------|------------------------------|----------------|-----------|
| Source Name       | The name of the source.      | Data Structure | Out       |
| Base Url          | The base path of the source. | Data Structure | Out       |
| Controller        | The controller name.         | Data Structure | Out       |
| Endpoint          | The endpoint name.           | Data Structure | Out       |
| Method            | The Http Method.             | Data Structure | Out       |
| Path              | The endpoint path.           | Data Structure | Out       |
| Query Parameters  | The query parameters.        | User           | Out       |
| Matrix Parameters | The matrix parameters.       | User           | Out       |
| Body              | The body content.            | User           | Out       |
| Encoding          | The body encoding.           | Data Structure | Out       |
| Description       | The endpoint description     | Data Structure | Out       |
| Tags              | The endpoint tags.           | Data Structure | Out       |
| Custom Headers    | The custom headers.          | User           | Out       |
| Response          | The response content.        | Data Structure | In        |
| Response Encoding | The response encoding.       | Data Structure | In        |
| Error Responses   | The error responses.         | Data Structure | In        |

## Technology vise usage.

| Name              | React                         | Angular                       |
|-------------------|-------------------------------|-------------------------------|
| Source Name       | Package name                  | Package name                  |
| Base Url          | Passed to communication layer | Passed to communication layer |
| Controller        | Package name                  | Service name                  |
| Endpoint          | fileName and hook name        | Method name                   |
| Method            | Passed to communication layer | Passed to communication layer |
| Path              | Passed to communication layer | Passed to communication layer |
| Query Parameters  | Parameter                     | Parameter                     |
| Matrix Parameters | Parameter                     | Parameter                     |
| Body              | Parameter                     | Parameter                     |
| Encoding          | Passed to communication layer | Passed to communication layer |
| Description       | Doc comments                  | Doc comments                  |
| Tags              | Doc comments                  | Doc comments                  |
| Custom Headers    | Passed to communication layer | Passed to communication layer |
| Response          | Return type                   | Return type                   |
| Response Encoding | Passed to communication layer | Passed to communication layer |
| Error Responses   | Return type                   | Return type                   |

## JSON Structure

```json
{
  "name": "string",
  "baseUrl": "string",
  "controllers": [
    {
      "name": "string",
      "endpoints": [
        {
          "name": "string",
          "method": "string",
          "path": "string",
          "queryParameters": [
            {
              "name": "string",
              "type": "string",
              "required": true,
              "description": "string"
            }
          ],
          "matrixParameters": [
            {
              "name": "string",
              "type": "string",
              "required": true,
              "description": "string"
            }
          ],
          "body": {
            "type": "string",
            "required": true,
            "description": "string"
          },
          "encoding": "string",
          "description": "string",
          "tags": [
            "string"
          ],
          "customHeaders": [
            {
              "name": "string",
              "type": "string",
              "required": true,
              "description": "string"
            }
          ],
          "response": {
            "type": "string",
            "description": "string"
          },
          "responseEncoding": "string",
          "errorResponses": [
            {
              "type": "string",
              "description": "string"
            }
          ]
        }
      ]
    }
  ]
}
```
