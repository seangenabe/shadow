# hardlink

[![Greenkeeper badge](https://badges.greenkeeper.io/seangenabe/hardlink.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/hardlink.svg?style=flat-square)](https://www.npmjs.com/package/hardlink)
[![Travis Build Status](https://img.shields.io/travis/seangenabe/hardlink/master.svg?label=travis&style=flat-square)](https://travis-ci.org/seangenabe/hardlink)
[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/seangenabe/hardlink/master.svg?label=appveyor&style=flat-square)](https://ci.appveyor.com/project/seangenabe/hardlink)
[![Dependency Status](https://img.shields.io/david/seangenabe/hardlink.svg?style=flat-square)](https://david-dm.org/seangenabe/hardlink)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/hardlink.svg?style=flat-square)](https://david-dm.org/seangenabe/hardlink#info=devDependencies)
[![node](https://img.shields.io/node/v/hardlink.svg?style=flat-square)](https://nodejs.org/en/download/)

Glob files and create hardlinks in another directory.

## Usage

```javascript
const hardlink = require('hardlink')
```

### hardlink(pattern, dest, opts)

Globs the current directory (`opts.cwd || process.cwd()`) and hardlinks the globbed files with the globbed folder structure into dest.

Parameters: 
* pattern - array | string - One or more [glob patterns](https://github.com/isaacs/minimatch#usage) to select the files to link
* dest - the destination directory
* opts - [options](https://github.com/sindresorhus/globby#options) to pass to `globby`

Returns a promise that resolves when all files have been hardlinked.

## Use case

You might have an output directory that might contain files from a source directory. In that case, a symbolic link or junction to the source directory might be desirable. But if you want to mix and match files from other sources into the output directory, you won't be able to use those. A hardlink for each file might be useful for this case.

## Related

* [copy-newer](https://github.com/seangenabe/copy-newer)
* [hardlink-cli](https://github.com/seangenabe/hardlink-cli)

## License 

MIT
