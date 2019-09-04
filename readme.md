# shadow

[![npm](https://img.shields.io/npm/v/@seangenabe/shadow.svg?style=flat-square)](https://www.npmjs.com/package/@seangenabe/shadow)
[![Build Status](https://img.shields.io/travis/seangenabe/shadow/master.svg&style=flat-square)](https://travis-ci.org/seangenabe/shadow)
[![Coveralls](https://img.shields.io/coveralls/github/seangenabe/shadow.svg?style=flat-square)](https://coveralls.io/github/seangenabe/shadow)
[![Dependency Status](https://img.shields.io/david/seangenabe/shadow.svg?style=flat-square)](https://david-dm.org/seangenabe/@seangenabe/shadow)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/shadow.svg?style=flat-square)](https://david-dm.org/seangenabe/@seangenabe/shadow#info=devDependencies)
[![node](https://img.shields.io/node/v/@seangenabe/shadow.svg?style=flat-square)](https://nodejs.org/en/download/)

Glob files and copy/symlink/hardlink in another directory.

## Usage

```javascript
import { shadow } from "@seangenabe/shadow"
```

### shadow(pattern, dest, opts)

Globs the current directory (`opts.cwd || process.cwd()`) and copies, symlinks, or hardlinks the globbed files with the globbed folder structure into dest.

Parameters:
* pattern - array | string - One or more [glob patterns](https://github.com/isaacs/minimatch#usage) to select the files to link
* dest - the destination directory
* opts - [options](https://github.com/sindresorhus/globby#options) to pass to `globby`
  * copyMode - `'symlink' | 'link'` - Symlink or hardlink the files. If unspecified, will simply copy the files.
  * fallback - Fall back to copying if there aren't enough permissions to symlink or hardlink (`EPERM`).

Returns a promise that resolves when all files have been hardlinked.

## CLI

```
shadow <cwd> <dest> [pattern = **]
```

Options:
* cwd, dest, pattern - same as above
* -m --mode - symlink or hardlink the file
* -f --fallback - fall back to copying the file on EPERM


## What happened to `hardlink`?

This package is modified from `hardlink`'s code and is a superset of its functionality.

## Related

* [copy-newer](https://github.com/seangenabe/copy-newer)

## License 

MIT
