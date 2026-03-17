declare module "creatorsapi-nodejs-sdk" {
  export class ApiClient {
    static instance: {
      basePath: string;
      setCredentialId(value: string): void;
      setCredentialSecret(value: string): void;
      setVersion(value: string): void;
      setAuthEndpoint(value: string): void;
    };
  }

  export class DefaultApi {
    constructor(apiClient?: typeof ApiClient.instance);
    searchItems(
      marketplace: string,
      options: { searchItemsRequestContent: Record<string, unknown> },
    ): Promise<unknown>;
    getItems(
      marketplace: string,
      request: Record<string, unknown>,
    ): Promise<unknown>;
  }
}
