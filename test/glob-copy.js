'use strict'

const test = require('ava')
const hardlink = require('..')
const FS = require('mz/fs')
const globby = require('globby')
const tempy = require('tempy')
const makeDir = require('make-dir')
const Path = require('path')

async function createTestRoot() {
  const root = await tempy.directory()
  let c = `${root}/a/b/c`
  await makeDir(c)
  await Promise.all([
    makeDir(`${root}/d`),
    FS.writeFile(Path.join(`${c}/text1.txt`), 'foo'),
    FS.writeFile(`${c}/text2.txt`, 'bar'),
    FS.writeFile(`${c}/json1.json`, '{}'),
    FS.writeFile(`${root}/a/b/text3.txt`, 'baz', {
      encoding: 'utf8'
    })
  ])
  return root
}

const modes = [undefined, 'link', 'symlink']

for (let mode of modes) {
  test(`glob copy ${mode}`, async t => {
    const root = await createTestRoot()
    const opts = { cwd: `${root}/a/b` }
    if (mode) {
      opts.copyMode = mode
    }
    await hardlink('**/*.txt', `${root}/d`, opts)
    let text1_contents = await FS.readFile(`${root}/d/c/text1.txt`, {
      encoding: 'utf8'
    })
    t.is(text1_contents, 'foo')
    let text2_contents = await FS.readFile(`${root}/d/c/text2.txt`, {
      encoding: 'utf8'
    })
    t.is(text2_contents, 'bar')
    let text3_contents = await FS.readFile(`${root}/d/text3.txt`, {
      encoding: 'utf8'
    })
    t.is(text3_contents, 'baz')

    if (mode === 'symlink' || mode === 'link') {
      // Edit a file then check if the linked file changed.
      await FS.writeFile(`${root}/a/b/c/text1.txt`, 'oof')
      let text1_contents_edited = await FS.readFile(`${root}/d/c/text1.txt`, {
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
