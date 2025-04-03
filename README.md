# TextEditor

[![NPM package](https://img.shields.io/npm/v/@infinityfx/text-editor)](https://www.npmjs.com/package/@infinityfx/text-editor)
[![NPM bundle size](https://img.shields.io/bundlephobia/minzip/@infinityfx/text-editor)](https://bundlephobia.com/package/@infinityfx/text-editor)
[![Last commit](https://img.shields.io/github/last-commit/infinityfx-llc/text-editor)](https://github.com/infinityfx-llc/text-editor)
![NPM weekly downloads](https://img.shields.io/npm/dw/@infinityfx/text-editor)
![NPM downloads](https://img.shields.io/npm/dt/@infinityfx/text-editor)

Rich text editor for React Fluid UI.

# Get started

## Installation

```sh
$ npm i @infinityfx/text-editor
```

## Usage

```tsx
import { TextEditor } from "@infinityfx/text-editor";

<TextEditor
    rows={4} // default: 1
    placeholder="Text" // default: ''
    formattingTools={["bold", "align"]} // default: ['bold', 'italic', 'underline']
/>;
```
