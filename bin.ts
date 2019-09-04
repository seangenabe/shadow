#!/usr/bin/env node

import { shadow } from './'
import minimist from 'minimist'
// @ts-ignore
import 'hard-rejection/register'

const args = minimist(process.argv.slice(2), {
  alias: { mode: 'm', fallback: 'f' },
  boolean: ['fallback']
})
const [cwd, dest, pattern = '**'] = args._
shadow(pattern, dest, { cwd, copyMode: args.mode, fallback: args.fallback })
