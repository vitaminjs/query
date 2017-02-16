
import Compiler, { createCompiler } from '../compiler'
import { isString } from 'lodash'

/**
 * @class BaseQuery
 */
export default class Query {

  /**
   * 
   * @constructor
   */
  constructor() {
    this._options = {}
  }

  /**
   * Set/Get a query option
   * 
   * @param {String} name
   * @param {Any} value
   * @returns {Any|Query}
   */
  option(name, value = undefined) {
    if ( undefined !== value ) {
      this._options[name] = value
      return this
    }

    return this._options[name]
  }

  /**
   * 
   * @returns {Object}
   */
  getOptions() {
    return this._options
  }
  
  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    return ''
  }

  /**
   * 
   * @param {String|Compiler} dialect
   * @param {Object} options
   * @returns {Object}
   */
  toSQL(dialect, options = {}) {
    if ( isString(dialect) )
      dialect = createCompiler(dialect, options)
    
    if ( dialect instanceof Compiler ) {
      let sql = this.compile(dialect)
      let params = dialect.getBindings()

      return { sql, params }
    }
    
    throw new TypeError("Invalid query compiler")
  }
  
}