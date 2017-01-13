
import { isString } from 'lodash'
import Expression from './base'
import Table from './table'

/**
 * @class JoinExpression
 */
export default class Join extends Expression {
  
  /**
   * 
   * @param {String|Table} table
   * @param {String} type
   * @param {Criteria} crirteria
   * @constructor
   */
  constructor(table, type = 'inner', criteria = null) {
    super()
    
    if ( isString(table) ) table = new Table(table)
    
    if (! (table instanceof Expression) )
      throw new TypeError("Invalid join table name")
    
    // TODO ensure the criteria
    
    this.type = type
    this.table = table
    this.criteria = criteria
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    var sql = this.type +' join '+ this.table.compile(compiler)
    
    if ( this.criteria != null )
      sql += ' on ' + this.criteria.compile(compiler)
    
    return sql
  }
  
  /**
   * 
   * @param {Any} expr
   * @returns {Boolean}
   */
  isEqual(expr) {
    return super.isEqual() || (
      expr instanceof Join && 
      expr.type === this.type &&
      this.table.isEqual(expr.table)
    )
  }
  
}
