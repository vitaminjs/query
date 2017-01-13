
import { compact, isEmpty, isObject, isArray, isNumber, isUndefined } from 'lodash'
import Expression from '../expression'

/**
 * @class BaseCompiler
 */
export default class Compiler {
  
  /**
   * BaseCompiler constructor
   * 
   * @constructor
   */
  constructor() {
    this.bindings = []
  }
  
  /**
   * Default parameter placeholder
   * 
   * @type {String}
   */
  get parameter() {
    return '?'
  }

  /**
   * 
   * @returns {Array}
   */
  getBindings() {
    return this.bindings
  }
  
  /**
   * 
   * @param {Object} query
   * @returns {String}
   */
  compileSelectComponents(query) {
    var sql = [
      this.compileColumns(query.columns, query),
      this.compileTables(query.tables, query),
      this.compileJoins(query.joins, query),
      this.compileConditions(query.conditions, query),
      this.compileGroups(query.groups, query),
      this.compileHavingConditions(query.havingConditions, query),
      this.compileOrders(query.orders, query),
      this.compileLimit(query.limit, query),
      this.compileOffset(query.offset, query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * 
   * @param {Object} query
   * @returns {String}
   */
  compileUnionComponents(query) {
    var sql = [
      this.compileUnions(query.unions, query),
      this.compileOrders(query.unionOrders, query),
      this.compileLimit(query.unionLimit, query),
      this.compileOffset(query.unionOffset, query),
    ]
    
    return compact(sql).join(' ')
  }
  
  /**
   * Compile the query columns part
   * 
   * @param {Array} columns
   * @param {Object} query
   * @returns {String}
   */
  compileColumns(columns, query) {
    var distinct = query.distinct ? 'distinct ' : ''

    return distinct + this.columnize(isEmpty(columns) ? ['*'] : columns)
  }
  
  /**
   * 
   * @param {Array} tables
   * @param {Object} query
   * @returns {String}
   */
  compileTables(tables, query) {
    if ( isEmpty(tables) ) return
    
    return 'from ' + tables.map(table => this.escape(table)).join(', ')
  }
  
  /**
   * 
   * @param {Array} joins
   * @param {Object} query
   * @returns {String}
   */
  compileJoins(joins, query) {
    if ( isEmpty(joins) ) return

    return joins.map(join => this.escape(join)).join(' ')
  }
  
  /**
   * 
   * @param {Criteria} conditions
   * @param {Object} query
   * @returns {String}
   */
  compileConditions(conditions, query) {
    if ( conditions.isEmpty() ) return
    
    return 'where ' + conditions.compile(this)
  }
  
  /**
   * 
   * @param {Array} groups
   * @param {Object} query
   * @returns {String}
   */
  compileGroups(groups, query) {
    if ( isEmpty(groups) ) return
    
    return 'group by ' + this.columnize(groups)
  }
  
  /**
   * 
   * @param {Criteria} conditions
   * @param {Object} query
   * @returns {String}
   */
  compileHavingConditions(conditions, query) {
    if ( conditions.isEmpty() ) return
    
    return 'having ' + conditions.compile(this)
  }
  
  /**
   * 
   * @param {Array} orders
   * @param {Object} query
   * @returns {String}
   */
  compileOrders(orders, query) {
    if ( isEmpty(orders) ) return
    
    return 'order by ' + this.columnize(orders)
  }
  
  /**
   * 
   * @param {Number} limit
   * @param {Object} query
   * @returns {String}
   */
  compileLimit(limit, query) {
    if (! isNumber(limit) ) return
    
    return 'limit ' + this.parameterize(limit)
  }
  
  /**
   * 
   * @param {Number} offset
   * @param {Object} query
   * @returns {String}
   */
  compileOffset(offset, query) {
    if (! isNumber(offset) ) return
    
    return 'offset ' + this.parameterize(offset)
  }
  
  /**
   * 
   * @param {Array} unions
   * @param {Object} query
   * @returns {String}
   */
  compileUnions(unions, query) {
    if ( isEmpty(unions) ) return

    return unions.map(union => this.escape(union)).join(' ')
  }
  
  /**
   * Validate the query operator
   * 
   * @param {String} value
   * @returns {String}
   */
  operator(value) {
    // TODO
    return value || '='
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {String}
   */
  parameterize(value) {
    // escape raw expressions
    if ( value instanceof Expression )
      return this.escape(value)
    
    if (! isArray(value) ) value = [value]
    
    // empty arrays are not accepted
    if ( isEmpty(value) )
      throw new TypeError("Invalid parameter value")
    
    return value.map(v => this.addBinding(v).parameter).join(', ')
  }
  
  /**
   * Add query binding value
   * 
   * @param {Any} value
   * @returns {Compiler}
   */
  addBinding(value) {
    if ( isUndefined(value) || isObject(value) )
      throw new TypeError("Invalid parameter value")
    
    this.bindings.push(value)
    
    return this
  }
  
  /**
   * 
   * @param {Array} columns
   * @returns {String}
   */
  columnize(columns) {
    if (! isArray(columns) ) columns = [columns]
    
    return columns.map(col => this.escape(col)).join(', ')
  }
  
  /**
   * Escape the given value
   * 
   * @param {String|Expression} value
   * @returns {String}
   */
  escape(value) {
    if ( value === '*' )
      return value
    
    // escape expressions
    if ( value instanceof Expression )
      return value.compile(this)

    throw new TypeError("Invalid expression to escape")
  }
  
  /**
   * Escape the table or column name
   * 
   * @param {String} value
   * @returns {String}
   */
  escapeIdentifier(value) {
    return (value === '*') ? value : `"${value.trim()}"`
  }
  
  /**
   * Join two identifiers by `AS` clause
   * 
   * @param {String} first
   * @param {String} second
   * @returns {String}
   */
  alias(first, second = null) {
    return first + (second ? ' as ' + this.escapeIdentifier(second) : '')
  }
  
}
