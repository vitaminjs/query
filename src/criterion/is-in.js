
import { Column } from '../expression/index'
import { isString, isArray } from 'lodash'
import Criterion from './base'

/**
 * @class IsInCriterion
 */
export default class IsIn extends Criterion {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {Array} values
   * @param {String} bool
   * @param {Boolean} negate
   * @constructor
   */
  constructor(expr, values, bool = 'and', negate = false) {
    super(bool)
    
    if ( isString(expr) ) expr = new Column(expr)
    
    if (! (expr instanceof Column && isArray(values)) )
      throw new TypeError("Invalid `in` condition")
    
    this.op = (negate ? 'not ' : '') + 'in'
    this.values = values
    this.column = expr
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @return string
   */
  compile(compiler) {
    var bool = super.compile(compiler)
    var operator = compiler.operator(this.op)
    var column = this.column.compile(compiler)
    var values = compiler.parameterize(this.values)
    
    return bool + column + operator + ` (${values})`
  }
  
}