export function extractBaseUrl(openApiDoc: any): string {
  // If no servers are defined, return an empty string
  if (!openApiDoc.servers || openApiDoc.servers.length === 0) {
    return '';
  }

  // Return the URL of the first server
  return openApiDoc.servers[0].url;
}
