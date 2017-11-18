'use strict'

const test = require('ava')
const hardlink = require('..')
const FS = require('mz/fs')
const globby = require('globby')
const tempy = require('tempy')
const mkdirp = require('mkdirp-promise')
const Path = require('path')

let root

test.before(async t => {
  root = await tempy.directory()
  let c = `${root}/a/b/c`
  await mkdirp(c)
  await Promise.all([
    mkdirp(`${root}/d`),
    FS.writeFile(Path.join(`${c}/text1.txt`), 'foo'),
    FS.writeFile(`${c}/text2.txt`, 'bar'),
    FS.writeFile(`${c}/json1.json`, '{}'),
    FS.writeFile(`${root}/a/b/text3.txt`, 'baz', {
      encoding: 'utf8'
    })
  ])
})

test('glob copy', async t => {
  await hardlink('**/*.txt', `${root}/d`, {
    cwd: `${root}/a/b`,
    verbose: true
  })
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

  // Edit a file then check if the linked file changed.
  await FS.writeFile(`${root}/a/b/c/text1.txt`, 'oof')
  let text1_contents_edited = await FS.readFile(`${root}/d/c/text1.txt`, {
    encoding: 'utf8'
  })
  t.is(text1_contents_edited, 'oof')
})

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
