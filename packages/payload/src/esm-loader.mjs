import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function resolve(specifier, context, next) {
  const nextResult = await next(specifier, context)

  if (!specifier.endsWith('.scss')) return nextResult

  return {
    format: 'scss',
    shortCircuit: true,
    url: nextResult.url,
  }
}

export async function load(url, context, next) {
  if (context.format !== 'scss') return next(url, context)

  const rawSource = '' + (await fs.readFile(fileURLToPath(url)))

  return {
    format: 'json',
    shortCircuit: true,
    source: JSON.stringify(rawSource),
  }
}

function parseCssToObject(rawSource) {
  const output = {}

  for (const rule of parseCSS(rawSource).stylesheet.rules) {
    let selector = rule['selectors'].at(-1) // Get right-most in the selector rule: `.Bar` in `.Foo > .Bar {…}`
    if (selector[0] !== '.') break // only care about classes

    selector = selector
      .substr(1) // Skip the initial `.`
      .match(/(\w+)/)[1] // Get only the classname: `Qux` in `.Qux[type="number"]`

    output[selector] = loadFullStyles ? getClassStyles(rule['declarations']) : selector
  }

  return output
}

function getClassStyles(declarations) {
  const styles = {}

  for (const declaration of declarations) {
    styles[declaration['property']] = declaration['value']
  }

  return styles
}
