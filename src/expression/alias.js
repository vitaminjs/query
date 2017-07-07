
import Expression from './base'

export default class Alias extends Expression {
  /**
   * @param {Any} value
   * @param {String} name
   * @param {Array} columns
   * @constructor
   */
  constructor (value, name, columns = []) {
    super()

    this.name = name
    this.value = value
    this.columns = columns
  }

  /**
   * @param {Compiler} compiler
   * @returns {String}
   * @override
   */
  compile (compiler) {
    return compiler.compileAlias(this)
  }
}