
import { isFunction, isString, isNull, isArray, each, isPlainObject, isUndefined } from 'lodash'
import Raw from './raw'

/**
 * @class Criteria
 */
export default class {
  
  /**
   * 
   * @constructor
   */
  constructor(builder) {
    this.builder = builder
    this.conditions = []
  }
  
  /**
   * 
   */
  where(column, operator, value, prefix = 'and', negate = false) {
    // support for .where(new Raw(expr, bindings))
    if ( column instanceof Raw ) 
      return this.whereRaw(column, null, prefix)
    
    // support for .where({a: 1, b: 3})
    if ( isPlainObject(column) ) {
      let obj = column
      
      column = cr => each(obj, (val, key) => cr.where(key, val))
    }
    
    // support for .where(q => { ... })
    if ( isFunction(column) ) {
      let fn = column
      
      fn(column = this.builder.newCriteria())
    }
    
    if ( !isUndefined(operator) && isUndefined(value) ) {
      value = operator
      operator = '='
    }
    
    // support for .where('column', null)
    if ( isNull(value) )
      return this.whereNull(column, prefix, negate)
    
    // format the operator
    operator = String(operator).toLowerCase().trim()
    
    // support for sub-queries
    if ( isFunction(value) || value instanceof this.builder.constructor ) {
      if ( operator === '=' ) operator = 'in'
      return this.whereSub(column, operator, value, prefix, negate)
    }
    
    // support for .where('column', [...])
    if ( isArray(value) && operator === '=' ) operator = 'in' 
    
    this.conditions.push({ column, operator, value, prefix, negate })
    
    return this
  }
  
  whereNot(column, operator, value) {
    return this.where(column, operator, value, 'and', true)
  }
  
  andWhere(column, operator, value) {
    return this.where(column, operator, value)
  }
  
  andWhereNot(column, operator, value) {
    return this.whereNot(column, operator, value)
  }
  
  orWhere(column, operator, value) {
    return this.where(column, operator, value, 'or')
  }
  
  orWhereNot(column, operator, value) {
    return this.where(column, operator, value, 'or', true)
  }
  
  or(column, operator, value) {
    return this.orWhere(column, operator, value)
  }
  
  orNot(column, operator, value) {
    return this.orWhereNot(column, operator, value)
  }
  
  and(column, operator, value) {
    return this.where(column, operator, value)
  }
  
  not(column, operator, value) {
    return this.whereNot(column, operator, value)
  }
  
  andNot(column, operator, value) {
    return this.whereNot(column, operator, value)
  }
  
  whereBetween(column, value, prefix = 'and', negate = false) {
    var operator = negate ? 'not between' : 'between'
    
    return this.where(column, operator, value, prefix)
  }
  
  whereNotBetween(column, value) {
    return this.whereBetween(column, value, 'and', true)
  }
  
  between(column, value) {
    return this.whereBetween(column, value)
  }
  
  notBetween(column, value) {
    return this.whereNotBetween(column, value)
  }
  
  andWhereBetween(column, value) {
    return this.whereBetween(column, value)
  }
  
  andWhereNotBetween(column, value) {
    return this.whereBetween(column, value, 'and', true)
  }
  
  andBetween(column, value) {
    return this.whereBetween(column, value)
  }
  
  andNotBetween(column, value) {
    return this.whereNotBetween(column, value)
  }
  
  orWhereBetween(column, value) {
    return this.whereBetween(column, value, 'or')
  }
  
  orWhereNotBetween(column, value) {
    return this.whereBetween(column, value, 'or', true)
  }
  
  orBetween(column, value) {
    return this.orWhereBetween(column, value)
  }
  
  orNotBetween(column, value) {
    return this.orWhereNotBetween(column, value)
  }
  
  whereLike(column, value, prefix = 'and', negate = false) {
    var operator = negate ? 'not like' : 'like'
    
    return this.where(column, operator, value, prefix)
  }
  
  whereNotLike(column, value) {
    return this.whereLike(column, value, 'and', true)
  }
  
  like(column, value) {
    return this.whereLike(column, value)
  }
  
  notLike(column, value) {
    return this.whereNotLike(column, value)
  }
  
  andWhereLike(column, value) {
    return this.whereLike(column, value)
  }
  
  andWhereNotLike(column, value) {
    return this.whereNotLike(column, value)
  }
  
  andLike(column, value) {
    return this.whereLike(column, value)
  }
  
  andNotLike(column, value) {
    return this.whereNotLike(column, value)
  }
  
  orWhereLike(column, value) {
    return this.whereLike(column, value, 'or')
  }
  
  orWhereNotLike(column, value) {
    return this.whereLike(column, value, 'or', true)
  }
  
  orLike(column, value) {
    return this.orWhereLike(column, value)
  }
  
  orNotLike(column, value) {
    return this.orWhereNotLike(column, value)
  }
  
  whereIn(column, value, prefix = 'and', negate = false) {
    var operator = negate ? 'not in' : 'in'
    
    return this.where(column, operator, value, prefix, negate)
  }
  
  whereNotIn(column, value) {
    return this.whereIn(column, value, 'and', true)
  }
  
  in(column, value) {
    return this.whereIn(column, value)
  }
  
  notIn(column, value) {
    return this.whereNotIn(column, value)
  }
  
  andWhereIn(column, value) {
    return this.whereIn(column, value)
  }
  
  andWhereNotIn(column, value) {
    return this.whereNotIn(column, value)
  }
  
  andIn(column, value) {
    return this.whereIn(column, value)
  }
  
  andNotIn(column, value) {
    return this.whereNotIn(column, value)
  }
  
  orWhereIn(column, value) {
    return this.whereIn(column, value, 'or')
  }
  
  orWhereNotIn(column, value) {
    return this.whereIn(column, value, 'or', true)
  }
  
  orIn(column, value) {
    return this.orWhereIn(column, value)
  }
  
  orNotIn(column, value) {
    return this.orWhereNotIn(column, value)
  }
  
  whereNull(column, prefix = 'and', negate = false) {
    var operator = negate ? 'is not' : 'is'
    
    this.conditions.push({ column, operator, value: null, prefix })
    
    return this
  }
  
  whereNotNull(column) {
    return this.whereNull(column, 'and', true)
  }
  
  isNull(column) {
    return this.whereNull(column)
  }
  
  isNotNull(column) {
    return this.whereNotNull(column)
  }
  
  andWhereNull(column) {
    return this.whereNull(column)
  }
  
  andWhereNotNull(column) {
    return this.whereNotNull(column)
  }
  
  andIsNull(column) {
    return this.whereNull(column)
  }
  
  andIsNotNull(column) {
    return this.whereNotNull(column)
  }
  
  orWhereNull(column) {
    return this.whereNull(column, 'or')
  }
  
  orWhereNotNull(column) {
    return this.whereNull(column, 'or', true)
  }
  
  orIsNull(column) {
    return this.orWhereNull(column)
  }
  
  orIsNotNull(column) {
    return this.orWhereNotNull(column)
  }
  
  whereRaw(expr, bindings = [], prefix = 'and') {
    if ( isString(expr) ) expr = new Raw(expr, bindings)
    
    if (! (expr instanceof Raw) ) 
      throw new TypeError("Invalid raw expression")
    
    this.conditions.push({ column: expr, prefix })
    
    return this
  }
  
  andWhereRaw(expr, bindings = []) {
    return this.whereRaw(expr, bindings)
  }
  
  orWhereRaw(expr, bindings = []) { 
    return this.whereRaw(expr, bindings, 'or')
  }
  
  raw(expr, bindings = []) {
    return this.whereRaw(expr, bindings)
  }
  
  andRaw(expr, bindings = []) {
    return this.whereRaw(expr, bindings)
  }
  
  orRaw(expr, bindings = []) {
    return this.orWhereRaw(expr, bindings)
  }
  
  whereColumn(first, operator, second, prefix = 'and') {
    if ( !isUndefined(operator) && isUndefined(second) ) {
      second = operator
      operator = '='
    }
    
    this.conditions.push({
      column: first, operator, value: second, prefix, isColumn: true
    })
    
    return this
  }
  
  andWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second)
  }
  
  orWhereColumn(first, operator, second) {
    return this.whereColumn(first, operator, second, 'or')
  }
  
  whereSub(column, operator, value, prefix = 'and', negate = false) {
    if ( isFunction(value) ) {
      let fn = value
      
      fn(value = this.builder.newQuery())
    }
    
    if ( value instanceof this.builder.constructor ) {
      let query = value.compile()
      
      value = new Raw(query.sql, query.bindings)
      
      this.conditions.push({ column, operator, value, prefix, negate })
      
      return this
    }
    
    throw new TypeError("Invalid sub-query expression")
  }
  
  whereExists(value, prefix = 'and', negate = false) {
    var operator = negate ? 'not exists' : 'exists'
    
    return this.whereSub(null, operator, value, prefix)
  }
  
  whereNotExists(value) {
    return this.whereExists(value, 'and', true)
  }
  
  exists(value) {
    return this.whereExists(value)
  }
  
  notExists(value) {
    return this.whereNotExists(value)
  }
  
  andWhereExists(value) {
    return this.whereExists(value)
  }
  
  andWhereNotExists(value) {
    return this.whereNotExists(value)
  }
  
  andExists(value) {
    return this.whereExists(value)
  }
  
  andNotExists(value) {
    return this.whereNotExists(value)
  }
  
  orWhereExists(value) {
    return this.whereExists(value, 'or')
  }
  
  orWhereNotExists(value) {
    return this.whereExists(value, 'or', true)
  }
  
  orExists(value) {
    return this.orWhereExists(value)
  }
  
  orNotExists(value) {
    return this.orWhereNotExists(value)
  }
  
}