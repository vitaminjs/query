
import Compiler from './base'

/**
 * @class MysqlCompiler
 */
export default class extends Compiler {
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : '`' + value.trim().replace(/`/g, '``') + '`'
  }
  
  /**
   * 
   * @param {Number} offset
   * @param {Object} query
   * @returns {String}
   */
  compileOffset(offset, query) {
    if ( offset == null ) return

    var expr = 'offset ' + this.parameterize(offset)
    
    return ((query.limit == null) ? 'limit 18446744073709551615 ' : '') + expr
  }
  
}