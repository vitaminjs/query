
import { isString } from 'lodash'
import Expression from './base'
import Order from './order'

/**
 * @class ColumnExpression
 */
export default class Column extends Expression {
  
  /**
   * 
   * @param {String} name
   * @param {String} table
   * @constructor
   */
  constructor(name, table = '') {
    super()
    
    this.name = name
    this.table = table
  }

  /**
   * 
   * @returns {String}
   */
  getName() {
    return this.alias || (this.table ? this.table + '.' : '') + this.name
  }

  /**
   * 
   * @param {String} value
   * @returns {Column}
   */
  setTable(value) {
    this.table = value
    return this
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var expr = compiler.escapeIdentifier(this.name)
    
    if ( this.table )
      expr = compiler.escapeIdentifier(this.table) + '.' + expr
    
    return compiler.alias(expr, this.alias)
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    if ( isString(expr) )
      return expr === this.getName()

    return super.isEqual() || (
      expr instanceof Column && this.getName() === expr.getName()
    )
  }

  /**
   * 
   * @returns {Order}
   */
  asc() {
    return new Order(this.getName())
  }

  /**
   * 
   * @returns {Order}
   */
  desc() {
    return new Order(this.getName(), 'desc')
  }
  
}
