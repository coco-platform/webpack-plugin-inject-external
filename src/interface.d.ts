// / <reference path="node_modules/webpack/types.d.ts" />

import { HtmlTagObject } from 'html-webpack-plugin';

export interface Linkage {
  url: string;
  [key: string]: unknown;
}

export interface ExternalDictionary {
  [name: string]: Linkage[];
}

export interface SplitedExternalModules {
  hits: string[];
  missings: string[];
}

export interface AlterAssetTagGroupsParts {
  headTags: HtmlTagObject[];
  bodyTags: HtmlTagObject[];
}

export interface InjectExternalOptions {
  env: string;
  definition: string;
}
