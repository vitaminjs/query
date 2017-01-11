
import { Column } from '../expression'
import { isString } from 'lodash'
import Criterion from './base'

/**
 * @class BasicCriterion
 */
export default class Basic extends Criterion {
  
  /**
   * 
   * @param {String|Expression} column
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} negate
   * @constructor
   */
  constructor(column, operator, value, bool = 'and', negate = false) {
    super(bool)
    
    if ( isString(column) ) column = new Column(column)
    
    if (! (column instanceof Column) )
      throw new TypeError("Invalid basic condition")
    
    this.not = negate ? 'not ' : ''
    this.column = column
    this.value = value
    this.op = operator
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
    var value = compiler.parametrize(this.value)
    
    return bool + this.not + column + ` ${operator} ` + value
  }
  
}