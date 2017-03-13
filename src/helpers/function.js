
import Expression, { Literal, Func } from '../expression'

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function ABS(expr) {
  return createFunction('abs', expr)
}

/**
 * 
 * @param {Any} x
 * @param {Integer} y
 * @returns {Func}
 */
export function ROUND(x, y) {
  return createFunction('round', x, y)
}

/**
 * A random float number between 0 and 1
 * 
 * @returns {Func}
 */
export function RAND() {
  return createFunction('rand')
}

/**
 * 
 * @see `RAND`
 */
export function RANDOM() {
  return RAND(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function UPPER(expr) {
  return createFunction('upper', ensureExpression(expr))
}

/**
 * 
 * @see `UPPER`
 */
export function UCASE() {
  return UPPER(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @return {Func}
 */
export function LOWER(expr) {
  return createFunction('lower', ensureExpression(expr))
}

/**
 * 
 * @see `LOWER`
 */
export function LCASE() {
  return LOWER(...arguments)
}

/**
 * 
 * @param {String|Expression} args
 * @returns {Func}
 */
export function CONCAT(...args) {
  return createFunction('concat', ...args)
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function LENGTH(expr) {
  return createFunction('length', ensureExpression(expr))
}

/**
 * 
 * @see `LENGTH`
 */
export function LEN() {
  return LENGTH(...arguments)
}

/**
 * 
 * @param {String|Expresion} expr
 * @param {Any} pattern
 * @param {Any} replacement
 * @returns {Func}
 */
export function REPLACE(expr, pattern, replacement) {
  return createFunction('replace', ensureExpression(expr), pattern, replacement)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} start
 * @param {Integer} length
 * @returns {Func}
 */
export function SUBSTR(expr, start, length) {
  if ( length == null )
    return createFunction('substr', ensureExpression(expr), start)
  else
    return createFunction('substr', ensureExpression(expr), start, length)
}

/**
 * 
 * @see `SUBSTR`
 */
export function SUBSTRING() {
  return SUBSTR(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function LEFT(expr, length) {
  return createFunction('left', ensureExpression(expr), length)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} length
 * @returns {Func}
 */
export function RIGHT(expr, length) {
  return createFunction('right', ensureExpression(expr), length)
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function TRIM(expr) {
  return createFunction('trim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function LTRIM(expr) {
  return createFunction('ltrim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Func}
 */
export function RTRIM(expr) {
  return createFunction('rtrim', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} str
 * @param {String|Expresion} substr
 * @returns {Func}
 */
export function STRPOS(str, substr) {
  return createFunction('strpos', ensureExpression(str), substr)
}

/**
 * 
 * @see `STRPOS`
 */
export function POSITION() {
  return STRPOS(...arguments)
}

/**
 * 
 * @param {String|Expression} expr
 * @param {Integer} count
 * @returns {Func}
 */
export function REPEAT(expr, count) {
  return createFunction('repeat', ensureExpression(expr), count)
}

/**
 * 
 * @param {Integer} length
 * @returns {Func}
 */
export function SPACE(length) {
  return createFunction('space', length)
}

/**
 * Returns the current local date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function NOW() {
  return createFunction('now')
}

/**
 * 
 * @see `NOW`
 */
export function DATETIME() {
  return NOW()
}

/**
 * Returns the current UTC date and time in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * @returns {Func}
 */
export function UTC() {
  return createFunction('utc')
}

/**
 * 
 * @see `UTC`
 */
export function UTC_DATETIME() {
  return UTC()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function DATE(expr) {
  return createFunction('date', ensureExpression(expr))
}

/**
 * Returns the current date in 'YYYY-MM-DD' format
 * 
 * @returns {Func}
 */
export function TODAY() {
  return createFunction('current_date')
}

/**
 * 
 * @see `TODAY`
 */
export function CURRENT_DATE() {
  return TODAY()
}

/**
 * 
 * @param {Any} expr
 * @returns {Func}
 */
export function TIME(expr) {
  return createFunction('time', ensureExpression(expr))
}

/**
 * 
 * @returns {Func}
 */
export function CLOCK() {
  return createFunction('current_time')
}

/**
 * 
 * @returns {Func}
 */
export function CURRENT_TIME() {
  return CLOCK()
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function DAY(expr) {
  return createFunction('day', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function MONTH(expr) {
  return createFunction('month', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expression} expr
 * @returns {Func}
 */
export function YEAR(expr) {
  return createFunction('year', ensureExpression(expr))
}

/**
 * 
 * @param {String|Expresion} expr
 * @returns {Expresion}
 * @private
 */
function ensureExpression(expr) {
  return expr instanceof Expression ? expr : Literal.from(expr)
}

/**
 * 
 * @param {String} name
 * @param {Array} args
 * @returns {Func}
 * @private
 */
function createFunction(name, ...args) {
  return new Func(name, ...args)
}