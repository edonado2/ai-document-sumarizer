declare module 'mammoth' {
  export interface ExtractRawTextOptions {
    path?: string;
    buffer?: Buffer;
  }

  export interface ExtractRawTextResult {
    value: string;
    messages: any[];
  }

  export function extractRawText(options: ExtractRawTextOptions): Promise<ExtractRawTextResult>;
}


