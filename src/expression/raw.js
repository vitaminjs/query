
import { isArray } from 'lodash'
import Expression from './base'

/**
 * @class Raw
 */
export default class Raw extends Expresion {
  
  /**
   * 
   * @param {String} expression
   * @param {Array} bindings
   * @constructor
   */
  constructor(expression, bindings = []) {
    if (! isArray(bindings) ) bindings = [bindings]
    
    this.expression = expression
    this.bindings = bindings
    this.name = null
    this.before = ''
    this.after = ''
    
    return this
  }
  
  /**
   * 
   * @param {String} before
   * @param {String} after
   * @return this raw
   */
  wrap(before = '(', after = ')') {
    this.before = before
    this.after = after
    return this
  }
  
  /**
   * 
   * @param {String} name
   * @return this raw
   */
  as(name) {
    this.name = name
    return this
  }
  
  compile(compiler) {
    var expr = this.expression.replace(/\?/g, compiler.parameter)
    var sql = compiler.alias(this.before + expr + this.after, this.name)
    
    this.bindings.forEach(value => compiler.addBinding(value))
    
    return sql
  }
  
}
