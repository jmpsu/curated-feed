export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  SESSIONS: KVNamespace;
  ENVIRONMENT: "development" | "staging" | "production";
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
}

// Type for Cloudflare D1 Database binding
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    batch(statements: D1PreparedStatement[]): Promise<any[]>;
    dump(): Promise<ArrayBuffer>;
    exec(query: string): Promise<any>;
  }

  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first(): Promise<any>;
    all(): Promise<any>;
    run(): Promise<any>;
  }

  // R2 bucket type
  interface R2Bucket {
    head(key: string): Promise<R2Object | null>;
    get(key: string): Promise<R2ObjectBody | null>;
    put(key: string, value: ReadableStream | ArrayBuffer | string, options?: R2PutOptions): Promise<R2Object>;
    delete(key: string): Promise<void>;
    list(options?: R2ListOptions): Promise<R2Objects>;
  }

  interface R2Object {
    key: string;
    version: string;
    size: number;
    etag: string;
    httpEtag: string;
    uploaded: Date;
    httpMetadata: any;
    customMetadata: Record<string, string>;
  }

  interface R2ObjectBody extends R2Object {
    body: ReadableStream;
    bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    blob(): Promise<Blob>;
    json(): Promise<any>;
  }

  interface R2PutOptions {
    httpMetadata?: any;
    customMetadata?: Record<string, string>;
  }

  interface R2ListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
    delimiter?: string;
    include?: string[];
  }

  interface R2Objects {
    objects: R2Object[];
    delimitedPrefixes: string[];
    isTruncated: boolean;
    cursor?: string;
  }

  // KV namespace type
  interface KVNamespace {
    get(key: string, options?: { type: "text" | "json" | "arrayBuffer" | "stream" }): Promise<any>;
    getWithMetadata(key: string, options?: { type: "text" | "json" | "arrayBuffer" | "stream" }): Promise<{ value: any; metadata: any } | null>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: KVPutOptions): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: KVListOptions): Promise<{ keys: Array<{ name: string; metadata?: any }>; list_complete: boolean; cursor?: string }>;
  }

  interface KVPutOptions {
    expirationTtl?: number;
    metadata?: any;
  }

  interface KVListOptions {
    limit?: number;
    prefix?: string;
    cursor?: string;
  }
}

export default Env;
