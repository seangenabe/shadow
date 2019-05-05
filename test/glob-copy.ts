import { shadow, ShadowOptions } from '..'
import tempy from 'tempy'
import makeDir from 'make-dir'
import { promises as FS } from 'fs'
import test from 'ava'
const { writeFile, readFile } = FS

async function createTestRoot() {
  const root = await tempy.directory()
  let c = `${root}/a/b/c`
  await makeDir(c)
  await Promise.all([
    makeDir(`${root}/d`),
    writeFile(`${c}/text1.txt`, 'foo'),
    writeFile(`${c}/text2.txt`, 'bar'),
    writeFile(`${c}/json1.json`, '{}'),
    writeFile(`${root}/a/b/text3.txt`, 'baz')
  ])
  return root
}

const modes = [undefined, 'link', 'symlink'] as (
  | 'link'
  | 'symlink'
  | undefined)[]

for (let mode of modes) {
  test(`glob copy ${mode}`, async t => {
    const root = await createTestRoot()
    const opts: ShadowOptions = { cwd: `${root}/a/b` }
    if (mode) {
      opts.copyMode = mode
    }
    await shadow('**/*.txt', `${root}/d`, opts)
    let text1_contents = await readFile(`${root}/d/c/text1.txt`, {
      encoding: 'utf8'
    })
    t.is(text1_contents, 'foo')
    let text2_contents = await readFile(`${root}/d/c/text2.txt`, {
      encoding: 'utf8'
    })
    t.is(text2_contents, 'bar')
    let text3_contents = await readFile(`${root}/d/text3.txt`, {
      encoding: 'utf8'
    })
    t.is(text3_contents, 'baz')

    if (mode === 'symlink' || mode === 'link') {
      // Edit a file then check if the linked file changed.
      await writeFile(`${root}/a/b/c/text1.txt`, 'oof')
      let text1_contents_edited = await readFile(`${root}/d/c/text1.txt`, {
        encoding: 'utf8'
      })
      t.is(text1_contents_edited, 'oof')
    }
  })
}

/*
Before:
|- a
  |- b
    |- c
      |- text1.txt
      |- text2.txt
      |- json1.json
    |- text3.txt
|- d
After:
|- a ...
|- d
  |- c
    |- text1.txt
    |- text2.txt
  |- text3.txt
*/
