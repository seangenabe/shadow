'use strict'

const globby = require('globby')
const FS = require('mz/fs')
const pMap = require('p-map')
const mkdirp = require('mkdirp-promise')
const Path = require('path')

async function hardlink(pattern, dest, opts = {}) {
  const { cwd = process.cwd() } = opts
  src = src.toString()
  dest = dest.toString()
  let files = await globby(pattern, opts)

  const dirs = new Set()
  async function ensureDirExists(dir) {
    const realdir = Path.resolve(dir)
    if (!dirs.has(realdir)) {
      await mkdirp(realdir)
      dirs.add(realdir)
    }
  }

  await pMap(
    files,
    async file => {
      const realfile = `${cwd}/${file}`
      const destpath = `${dest}/${file}`
      await ensureDirExists(`${destpath}/..`)
      await FS.link(realfile, destpath)
    },
    { concurrency: 32 }
  )
}

module.exports = hardlink
