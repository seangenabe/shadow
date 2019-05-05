import globby, { GlobbyOptions } from 'globby'
import pMap from 'p-map'
import makeDir from 'make-dir'
import { resolve } from 'path'
import del from 'del'
import { promises as FS } from 'fs'
const { copyFile } = FS

export async function shadow(
  pattern: string | ReadonlyArray<string>,
  dest: string,
  opts: ShadowOptions = {}
) {
  const { cwd = process.cwd(), copyMode, fallback } = opts
  dest = dest.toString()
  let files = await globby(pattern, opts)

  const dirs = new Set<string>()
  async function ensureDirExists(dir: string) {
    const realdir = resolve(dir)
    if (!dirs.has(realdir)) {
      await makeDir(realdir)
      dirs.add(realdir)
    }
  }

  await pMap(
    files,
    async file => {
      const realfile = resolve(`${cwd}/${file}`)
      const destpath = `${dest}/${file}`
      await ensureDirExists(`${destpath}/..`)
      await del([destpath])
      if (copyMode === 'link' || copyMode === 'symlink') {
        try {
          await FS[copyMode](realfile, destpath)
        } catch (err) {
          if (err.code === 'EPERM' && fallback) {
            await copyFile(realfile, destpath)
          } else {
            throw err
          }
        }
      } else {
        await copyFile(realfile, destpath)
      }
    },
    { concurrency: 32 }
  )
}

export interface ShadowOptions extends GlobbyOptions {
  copyMode?: 'link' | 'symlink'
  fallback?: boolean
}
