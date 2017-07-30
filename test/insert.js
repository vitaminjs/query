/* global describe */

var support = require('./support')
var { table, selectFrom } = require('../dist')

describe('test building insert queries:', () => {
  support.test(
    'accepts a plain object data for single row insert',
    table('people').insert({ name: 'foo', age: 30 }),
    {
      pg: 'insert into "people" ("name", "age") values ($1, $2)',
      mysql: 'insert into `people` (`name`, `age`) values (?, ?)',
      mssql: 'insert into [people] ([name], [age]) values (?, ?)',
      sqlite: 'insert into "people" ("name", "age") values (?, ?)'
    },
    [
      'foo',
      30
    ]
  )

  support.test(
    'accepts an array of plain objects for multirow insert',
    table('people').insert({ name: 'foo', age: 30 }, { name: 'bar', age: 40 }),
    {
      pg: 'insert into "people" ("name", "age") values ($1, $2), ($3, $4)',
      mysql: 'insert into `people` (`name`, `age`) values (?, ?), (?, ?)',
      mssql: 'insert into [people] ([name], [age]) values (?, ?), (?, ?)',
      sqlite: 'insert into "people" ("name", "age") values (?, ?), (?, ?)'
    },
    [
      'foo',
      30,
      'bar',
      40
    ]
  )

  support.test(
    'inserts an new row with default values',
    table('foo').insert().defaultValues(),
    {
      pg: 'insert into "foo" default values',
      mysql: 'insert into `foo` () values ()',
      mssql: 'insert into [foo] default values',
      sqlite: 'insert into "foo" default values'
    }
  )

  support.test(
    'replaces missing bindings with defaults for multirow insert',
    table('coords').insert({ x: 20 }, { y: 40 }, { x: 10, y: 30 }),
    {
      pg: 'insert into "coords" ("x", "y") values ($1, default), (default, $2), ($3, $4)',
      mysql: 'insert into `coords` (`x`, `y`) values (?, default), (default, ?), (?, ?)',
      mssql: 'insert into [coords] ([x], [y]) values (?, default), (default, ?), (?, ?)',
      sqlite: 'insert into "coords" ("x", "y") values (?, null), (null, ?), (?, ?)'
    },
    [
      20,
      40,
      30,
      10
    ]
  )

  support.test(
    'adds a returning clause',
    table('users').insert({ fname: 'foo', lname: 'bar' }).returning('id'),
    {
      pg: 'insert into "users" ("fname", "lname") values ($1, $2) returning "id"',
      mssql: 'insert into [users] ([fname], [lname]) output inserted.[id] values (?, ?)'
    },
    [
      'foo',
      'bar'
    ]
  )

  support.test(
    'using a select query as values',
    selectFrom('another_table').take(3).into('target', 'a', 'b'),
    {
      pg: 'insert into "target" ("a", "b") select * from another_table limit $1',
      mysql: 'insert into `target` (`a`, `b`) select * from another_table limit ?',
      mssql: 'insert into [target] ([a], [b]) select top (?) * from another_table',
      sqlite: 'insert into "target" ("a", "b") select * from another_table limit ?'
    },
    [
      3
    ]
  )
})
