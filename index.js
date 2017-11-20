'use strict'

const globby = require('globby')
const FS = require('mz/fs')
const pMap = require('p-map')
const makeDir = require('make-dir')
const Path = require('path')
const cpFile = require('cp-file')
const del = require('del')
const log = require('util').debuglog('shadow')

async function shadow(pattern, dest, opts = {}) {
  const { cwd = process.cwd(), copyMode, fallback } = opts
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
    async (file, idx) => {
      const realfile = Path.resolve(`${cwd}/${file}`)
      const destpath = `${dest}/${file}`
      await ensureDirExists(`${destpath}/..`)
      await del([destpath])
      if (copyMode === 'link' || copyMode === 'symlink') {
        try {
          await FS[copyMode](realfile, destpath)
        } catch (err) {
          if (err.code === 'EPERM' && fallback) {
            await cpFile(realfile, destpath)
          } else {
            throw err
          }
        }
      } else {
        await cpFile(realfile, destpath)
      }
    },
    { concurrency: 32 }
  )
}

module.exports = shadow
