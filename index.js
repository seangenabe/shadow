'use strict'

const globby = require('globby')
const FS = require('mz/fs')
const pMap = require('p-map')
const makeDir = require('make-dir')
const Path = require('path')
const cpFile = require('cp-file')

async function shadow(pattern, dest, opts = {}) {
  const { cwd = process.cwd(), copyMode } = opts
  pattern = pattern.toString()
  dest = dest.toString()
  let files = await globby(pattern, opts)

  const dirs = new Set()
  async function ensureDirExists(dir) {
    const realdir = Path.resolve(dir)
    if (!dirs.has(realdir)) {
      await makeDir(realdir)
      dirs.add(realdir)
    }
  }

  await pMap(
    files,
    async file => {
      const realfile = `${cwd}/${file}`
      const destpath = `${dest}/${file}`
      await ensureDirExists(`${destpath}/..`)
      switch (copyMode) {
        case 'link':
          await FS.link(realfile, destpath)
          break
        case 'symlink':
          await FS.symlink(realfile, destpath)
          break
        default:
          await cpFile(realfile, destpath)
      }
    },
    { concurrency: 32 }
  )
}

module.exports = shadow
