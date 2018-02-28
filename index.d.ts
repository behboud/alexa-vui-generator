declare module "alexa-vui-generator" {
  export interface VUIOptions {
    intentCreators: Promise<Array<Object>>;
    typeCreators: Promise<Array<Object>>;
    invocation: String;
    postProcessor?: Function;
    pretty?: Boolean;
  }
  export function createLanguageModel(
    options: VUIOptions,
    locale: String
  ): Promise<Object>;
  export function readIntentsFromYAML(locale?: String): Promise<Array<Object>>;
  export function readTypesFromYAML(locale?: String): Promise<Array<Object>>;
}
