// Generator für Logik-/Bedingungs-Aufgaben: Variablenwerte + boolescher Ausdruck
// (UND/ODER/NICHT, Vergleiche) -> wahr/falsch, mit Auswertungsschritten.

const rnd10 = () => Math.floor(Math.random() * 10)
const pick = <T>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]

type Op = [string, (x: number, y: number) => boolean]
const OPS: Op[] = [
  ['>', (x, y) => x > y],
  ['<', (x, y) => x < y],
  ['>=', (x, y) => x >= y],
  ['<=', (x, y) => x <= y],
  ['==', (x, y) => x === y],
  ['!=', (x, y) => x !== y],
]

const VARS = ['a', 'b', 'c'] as const
type VarName = (typeof VARS)[number]
type Vals = Record<VarName, number>

interface Comp {
  text: string
  value: boolean
  step: string
}

function genComp(vals: Vals): Comp {
  const lhs = pick(VARS)
  const [sym, fn] = pick(OPS)
  const useConst = Math.random() < 0.5
  const rhsName = pick(VARS)
  const rhsConst = rnd10()
  const rhsText = useConst ? String(rhsConst) : rhsName
  const rhsVal = useConst ? rhsConst : vals[rhsName]
  const lhsVal = vals[lhs]
  const value = fn(lhsVal, rhsVal)
  return {
    text: `${lhs} ${sym} ${rhsText}`,
    value,
    step: `${lhs} ${sym} ${rhsText}  →  ${lhsVal} ${sym} ${rhsVal}  →  ${value ? 'wahr' : 'falsch'}`,
  }
}

export interface LogicDrill {
  vars: Vals
  expr: string
  steps: string[]
  result: boolean
}

const tf = (b: boolean) => (b ? 'wahr' : 'falsch')

export function randomLogic(): LogicDrill {
  const vars: Vals = { a: rnd10(), b: rnd10(), c: rnd10() }
  const shape = pick(['and', 'or', 'notAnd', 'notOr', 'notSingle'] as const)

  if (shape === 'notSingle') {
    const c = genComp(vars)
    return {
      vars,
      expr: `NICHT (${c.text})`,
      steps: [c.step, `NICHT (${tf(c.value)})  →  ${tf(!c.value)}`],
      result: !c.value,
    }
  }

  const c1 = genComp(vars)
  const c2 = genComp(vars)
  const isOr = shape === 'or' || shape === 'notOr'
  const inner = isOr ? c1.value || c2.value : c1.value && c2.value
  const conn = isOr ? 'ODER' : 'UND'
  const negate = shape === 'notAnd' || shape === 'notOr'
  const result = negate ? !inner : inner

  const combineStep = `${tf(c1.value)} ${conn} ${tf(c2.value)}  →  ${tf(inner)}`
  const steps = [c1.step, c2.step, combineStep]
  let expr = `(${c1.text}) ${conn} (${c2.text})`
  if (negate) {
    expr = `NICHT ( ${expr} )`
    steps.push(`NICHT (${tf(inner)})  →  ${tf(result)}`)
  }

  return { vars, expr, steps, result }
}
