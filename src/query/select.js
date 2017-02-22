
import Expression, { Literal, SubQuery, Join } from '../expression'
import { isString, isFunction } from 'lodash'
import { Criteria } from '../criterion'
import Query from './base'

/**
 * 
 */
export default class Select extends Query {

  constructor() {
    super()

    this._joins             = []
    this._tables            = []
    this._groups            = []
    this._orders            = []
    this._columns           = []
    this._limit             = null
    this._offset            = null
    this._conditions        = null
    this._havingConditions  = null
    this._distinct          = false
  }

  /**
   * 
   * @param {String} name
   * @returns {SubQuery}
   */
  as(name) {
    return this.toExpression().as(name)
  }

  /**
   * 
   * @returns {Select}
   */
  newQuery() {
    return new Select()
  }

  /**
   * 
   * @returns {SubQuery}
   */
  toExpression() {
    return new SubQuery(this)
  }

  /**
   * 
   * @returns {Select}
   */
  clone() {
    var query = new Select()

    this.isDistinct() && query.distinct()
    this.hasLimit() && query.limit(this.getLimit())
    this.hasOffset() && query.offset(this.getOffset())
    this.hasJoins() && query.setJoins(this.getJoins().slice())
    this.hasTables() && query.setTables(this.getTables().slice())
    this.hasGroups() && query.setGroups(this.getGroups().slice())
    this.hasOrders() && query.setOrders(this.getOrders().slice())
    this.hasColumns() && query.setColumns(this.getColumns().slice())
    this.hasConditions() && query.setConditions(this.getConditions().clone())
    this.hasHavingConditions() && query.setHavingConditions(this.getHavingConditions().clone())

    return query.setOptions(this.getOptions())
  }

  /**
   * 
   * @param {Compiler} compiler
   * @returns {String}
   */
  compile(compiler) {
    if (! (this.hasColumns() || this.hasTables()) ) return ''

    return compiler.compileSelectQuery(this)
  }

  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  select(...columns) {
    for ( let value of columns )
      this.addColumn(value)
    
    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addColumn(value) {
    if ( isString(value) )
      value = Literal.from(value)
    
    this.getColumns().push(value)
    
    return this
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setColumns(value) {
    this._columns = value
    return this
  }

  /**
   * 
   * @returns {Select}
   */
  resetColumns() {
    return this.setColumns([])
  }

  /**
   * 
   * @returns {Array}
   */
  getColumns() {
    return this._columns
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasColumns() {
    return this._columns.length > 0
  }

  /**
   * 
   * @param {Boolean} flag
   * @returns {Select}
   */
  distinct(flag = true) {
    this._distinct = flag
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  isDistinct() {
    return this._distinct
  }
  
  /**
   * 
   * @param {Any} tables
   * @returns {Select}
   */
  from(...tables) {
    for ( let value of tables )
      this.addTable(value)

    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addTable(value) {
    if ( isString(value) )
      value = Literal.from(value)

    if ( isFunction(value) ) {
      let fn = value

      fn(value = this.newQuery())
    }

    if ( value instanceof Select )
      value = value.toExpression()
    
    if (! (value instanceof Expression) )
      throw new TypeError("Invalid table expression")
    
    this.getTables().push(value)
    
    return this
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasTables() {
    return this._tables.length > 0
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setTables(value) {
    this._tables = value
    return this
  }

  /**
   * 
   * @returns {Tables}
   */
  getTables() {
    return this._tables
  }

  /**
   * 
   * @returns {Select}
   */
  resetTables() {
    return this.setTables([])
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Select}
   */
  limit(value) {
    this._limit = value
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasLimit() {
    return this._limit != null
  }

  /**
   * 
   * @returns {Integer}
   */
  getLimit() {
    return this._limit
  }

  /**
   * 
   * @returns {Select}
   */
  resetLimit() {
    this._limit = null
    return this
  }
  
  /**
   * 
   * @param {Integer} value
   * @returns {Select}
   */
  offset(value) {
    this._offset = value
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasOffset() {
    return this._offset != null
  }

  /**
   * 
   * @returns {Integer}
   */
  getOffset() {
    return this._offset
  }

  /**
   * 
   * @returns {Select}
   */
  resetOffset() {
    this._offset = null
    return this
  }

  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  groupBy(...columns) {
    for ( let value of columns )
      this.addGroup(value)
    
    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addGroup(value) {
    if ( isString(value) )
      value = Literal.from(value)

    this.getGroups().push(value)
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasGroups() {
    return this._groups.length > 0
  }

  /**
   * 
   * @returns {Array}
   */
  getGroups() {
    return this._groups
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setGroups(value) {
    this._groups = value
    return this
  }
  
  /**
   * 
   * @returns {Select}
   */
  resetGroups() {
    return this.setGroups([])
  }
  
  /**
   * 
   * @param {Any} columns
   * @returns {Select}
   */
  orderBy(...columns) {
    for ( let value of columns )
      this.addOrder(value)

    return this
  }
  
  /**
   * 
   * @param {Any} value
   * @returns {Select}
   */
  addOrder(value) {
    if ( isString(value) )
      value = Literal.from(value)

    this.getOrders().push(value)
    
    return this
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasOrders() {
    return this._orders.length > 0
  }

  /**
   * 
   * @param {Array} value
   * @returns {Select}
   */
  setOrders(value) {
    this._orders = value
    return this
  }

  /**
   * 
   * @returns {Orders}
   */
  getOrders() {
    return this._orders
  }

  /**
   * 
   * @returns {Select}
   */
  resetOrders() {
    return this.setOrders([])
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @param {String} type
   * @returns {Select}
   */
  join(table, first, operator, second, type = 'inner') {
    var criteria = null

    // handle raw expressions
    if ( table instanceof Literal ) {
      this.getJoins().push(table)
      return this
    }
      
    // add the join criteria object
    if ( first != null )
      criteria =  new Criteria().where(first, operator, second)
    
    return this.addJoin(type, table, criteria)
  }
  
  /**
   * 
   * @param {String} type
   * @param {Any} table
   * @param {Criteria} criteria
   * @returns {Select}
   */
  addJoin(type, table, criteria = null) {
    // handle strings
    if ( isString(table) )
      table = Literal.from(table)
    
    // handle functions
    if ( isFunction(table) ) {
      let fn = table

      fn(table = this.newQuery())
    }

    // handle sub queries
    if ( table instanceof Select )
      table = table.toExpression()
    
    if (! (table instanceof Expression) )
      throw new TypeError("Invalid join expression")
      
    this.getJoins().push(new Join(table, type, criteria))
    
    return this
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  innerJoin(table, first, operator, second) {
    return this.join(table, first, operator, second)
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  rightJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'right')
  }
  
  /**
   * 
   * @param {Any} table
   * @param {Any} first
   * @param {String} operator
   * @param {Any} second
   * @returns {Select}
   */
  leftJoin(table, first, operator, second) {
    return this.join(table, first, operator, second, 'left')
  }
  
  /**
   * 
   * @param {Any} table
   * @returns {Select}
   */
  crossJoin(table) {
    return this.addJoin('cross', table)
  }
  
  /**
   * 
   * @returns {Boolean}
   */
  hasJoins() {
    return this._joins.length > 0
  }

  /**
   * @param {Array} value
   * @returns {Select}
   */
  setJoins(value) {
    this._joins = value
    return this
  }

  /**
   * 
   * @returns {Array}
   */
  getJoins() {
    return this._joins
  }

  /**
   * 
   * @returns {Select}
   */
  resetJoins() {
    return this.setJoins([])
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Select}
   */
  where(expr, operator, value, bool = 'and', not = false) {
    this.getConditions().where(expr, operator, value, bool, not)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {Boolean} not
   * @returns {Select}
   */
  orWhere(expr, operator, value) {
    return this.where(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Select}
   */
  whereNot(expr, operator, value, bool = 'and') {
    this.getConditions().whereNot(expr, operator, value, bool)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Select}
   */
  orWhereNot(expr, operator, value) {
    return this.whereNot(expr, operator, value, 'or')
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasConditions() {
    return !( this._conditions == null || this._conditions.isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Select}
   */
  setConditions(value) {
    this._conditions = value
    return this
  }

  /**
   * 
   * @returns {Select}
   */
  resetConditions() {
    return this.setConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getConditions() {
    if ( this._conditions == null )
      this.resetConditions()

    return this._conditions
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @param {Boolean} not
   * @returns {Select}
   */
  having(expr, operator, value, bool = 'and', not = false) {
    this.getHavingConditions().where(expr, operator, value, bool, not)
    return this
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Select}
   */
  orHaving(expr, operator, value) {
    return this.having(expr, operator, value, 'or')
  }
  
  /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @param {String} bool
   * @returns {Select}
   */
  havingNot(expr, operator, value, bool = 'and') {
    this.getHavingConditions().whereNot(expr, operator, value, bool, true)
    return this
  }
  
   /**
   * 
   * @param {Any} expr
   * @param {String} operator
   * @param {Any} value
   * @returns {Select}
   */
  orHavingNot(expr, operator, value) {
    return this.havingNot(expr, operator, value, 'or')
  }

  /**
   * 
   * @returns {Boolean}
   */
  hasHavingConditions() {
    return !( this._havingConditions == null || this._havingConditions.isEmpty() )
  }

  /**
   * 
   * @param {Criteria} value
   * @returns {Select}
   */
  setHavingConditions(value) {
    this._havingConditions = value
    return this
  }

   /**
   * 
   * @returns {Select}
   */
  resetHavingConditions() {
    return this.setHavingConditions(new Criteria())
  }

  /**
   * 
   * @returns {Criteria}
   */
  getHavingConditions() {
    if ( this._havingConditions == null )
      this.resetHavingConditions()

    return this._havingConditions
  }

}