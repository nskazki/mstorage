'use strict'

import { isEqual, isObject, isUndefined } from 'lodash'
import { inspect } from 'util'
import { red, green, blue } from 'chalk'
import difflet from 'difflet'

let fmt = v => inspect(v, { depth: null, colors: true })
let tap = (str, repeat=1) => {
  var newline = '\n'
  for (let i = 0; i < repeat; i++) newline += '\t'
  return str.split('\n').join(newline)
}

let diff = difflet({ indent : 2 }).compare
let resetClr = '\u001b[0m'

export default function pretttyAssert(actual, expected, message) {
  if (isUndefined(message)) {
    message = expected || 'value must be true!'
    expected = true
  }

  if (isEqual(actual, expected)) {
    return
  } else if (isObject(actual) && isObject(expected)) {
    throw new Error(`${resetClr}${message}\
      \n\t actual:\
      \n\t \t${tap(fmt(actual), 2)}\
      \n\t expected:\
      \n\t \t${tap(fmt(expected), 2)}\
      \n\t diff: ${green('inserted')} ${blue('updated')} ${red('deleted')}\
      \n\t \t${tap(diff(actual, expected), 2)}`)
  } else {
    throw new Error(`${resetClr}${message}\
      \n\t actual:\
      \n\t \t${tap(fmt(actual), 2)}\
      \n\t expected:\
      \n\t \t${tap(fmt(expected), 2)}`)
  }
}
