
import Literal from './literal'
import Statement from './statement'
import Expression from '../expression'
import { isPlainObject, isNull, isArray } from 'lodash'

export default class Criteria extends Expression implements ICriteria {
  public value: IExpression
  
  public prefix: string
  
  public negate: boolean
  
  public constructor (value: IExpression, prefix = 'and', negate = false) {
    super()
    
    this.value = value
    this.prefix = prefix
    this.negate = negate
  }
  
  public static from (obj: { [key: string]: any  }): Criteria
  public static from (expr: string, args: any[]): Criteria
  public static from (expr: Criteria): Criteria
  public static from (value, args = []) {
    if (value instanceof Criteria) return value
    
    if (isPlainObject(value)) return this.fromObject(value)
    
    return new Criteria(Literal.from(value, args))
  }
  
  public static fromObject (obj: { [key: string]: any  }): Criteria {
    let args = []
    let expr = Object.keys(obj).map((key) => {
      let value = obj[key]
      
      if (isNull(value)) return `${key} is null`
      
      args.push(value)
      
      if (isArray(value)) return `${key} in (?)`
      
      if (value instanceof Statement) return `${key} in ?`
      
      return `${key} = ?`
    })
    
    return new Criteria(new Literal(expr.join(' and '), args))
  }
  
  public not (flag = true): Criteria {
    this.negate = flag
    return this
  }
  
  public and (): Criteria {
    this.prefix = 'and'
    return this
  }
  
  public or (): Criteria {
    this.prefix = 'or'
    return this
  }
  
  public compile (compiler: ICompiler): string {
    return compiler.compileCriteria(this)
  }
  
  public clone (): Criteria {
    return new Criteria(this.value, this.prefix, this.negate)
  }
}
