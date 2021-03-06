/* global describe */

var support = require('./support')
var qb = require('../lib/builder').factory
var { table, id, raw, asc, desc } = require('../lib/helpers')

describe('test building select queries:', function () {
  describe('test select():', function () {
    support.test(
      'returns empty string for empty queries',
      qb().select(),
      {
        pg: '',
        mysql: '',
        mssql: '',
        sqlite: ''
      }
    )

    support.test(
      'accepts literal values',
      qb().select(123, true, null, "'xyz'"),
      {
        pg: "select 123, true, null, 'xyz'",
        mysql: "select 123, true, null, 'xyz' from dual",
        mssql: "select 123, true, null, 'xyz'",
        sqlite: "select 123, true, null, 'xyz'"
      }
    )

    support.test(
      'accepts raw expressions',
      qb().select(raw('(1 + ?) as operation', 2)),
      {
        pg: 'select (1 + $1) as operation',
        mysql: 'select (1 + ?) as operation from dual',
        mssql: 'select (1 + ?) as operation',
        sqlite: 'select (1 + ?) as operation'
      },
      [
        2
      ]
    )

    support.test(
      'accepts sub queries',
      qb().select(qb().select('count(*)').from('atable').as('result')),
      {
        pg: 'select (select count(*) from "atable") as "result"',
        mysql: 'select (select count(*) from `atable`) as `result` from dual',
        mssql: 'select (select count(*) from [atable]) as [result]',
        sqlite: 'select (select count(*) from "atable") as "result"'
      }
    )

    support.test(
      'selects distinct columns',
      qb().select('foo', id('bar')).distinct(),
      {
        pg: 'select distinct foo, "bar"',
        mysql: 'select distinct foo, `bar` from dual',
        mssql: 'select distinct foo, [bar]',
        sqlite: 'select distinct foo, "bar"'
      }
    )
  })

  describe('test from():', function () {
    support.test(
      'accepts a raw table expression',
      qb().select().from('table'),
      {
        pg: 'select * from "table"',
        mysql: 'select * from `table`',
        mssql: 'select * from [table]',
        sqlite: 'select * from "table"'
      }
    )

    support.test(
      'adds a table expression',
      qb().select().from(id('schema.table').as('alias')),
      {
        pg: 'select * from "schema"."table" as "alias"',
        mysql: 'select * from `schema`.`table` as `alias`',
        mssql: 'select * from [schema].[table] as [alias]',
        sqlite: 'select * from "schema"."table" as "alias"'
      }
    )

    support.test(
      'overrides the table name when called multiple times',
      qb().select().from('a').from('b'),
      {
        pg: 'select * from "b"',
        mysql: 'select * from `b`',
        mssql: 'select * from [b]',
        sqlite: 'select * from "b"'
      }
    )

    support.test(
      'accepts raw expressions',
      qb().select().from(raw('schema.table as t')),
      {
        pg: 'select * from schema.table as t',
        mysql: 'select * from schema.table as t',
        mssql: 'select * from schema.table as t',
        sqlite: 'select * from schema.table as t'
      }
    )

    support.test(
      'accepts sub queries',
      qb().from(qb().select('*').from('a_table')),
      {
        pg: 'select * from (select * from "a_table")',
        mysql: 'select * from (select * from `a_table`)',
        mssql: 'select * from (select * from [a_table])',
        sqlite: 'select * from (select * from "a_table")'
      }
    )
  })

  describe('test join():', function () {
    support.test(
      'adds a basic join clause',
      qb().select().from('posts as p').join('users as a').on('p.author_id = a.id'),
      {
        pg: 'select * from "posts" as "p" inner join "users" as "a" on (p.author_id = a.id)',
        mysql: 'select * from `posts` as `p` inner join `users` as `a` on (p.author_id = a.id)',
        mssql: 'select * from [posts] as [p] inner join [users] as [a] on (p.author_id = a.id)',
        sqlite: 'select * from "posts" as "p" inner join "users" as "a" on (p.author_id = a.id)'
      }
    )

    support.test(
      'adds a table join with more than one condition',
      qb().select().from('departments as d').join('employees as e').on('e.department_id = d.id and e.salary > ?', 2500),
      {
        pg: 'select * from "departments" as "d" inner join "employees" as "e" on (e.department_id = d.id and e.salary > $1)',
        mysql: 'select * from `departments` as `d` inner join `employees` as `e` on (e.department_id = d.id and e.salary > ?)',
        mssql: 'select * from [departments] as [d] inner join [employees] as [e] on (e.department_id = d.id and e.salary > ?)',
        sqlite: 'select * from "departments" as "d" inner join "employees" as "e" on (e.department_id = d.id and e.salary > ?)'
      },
      [
        2500
      ]
    )

    support.test(
      'adds a raw join expression',
      qb().select().from(id('table1')).join(raw(`natural full join ?`, id('table2'))),
      {
        pg: 'select * from "table1" natural full join "table2"',
        mysql: 'select * from `table1` natural full join `table2`',
        mssql: 'select * from [table1] natural full join [table2]',
        sqlite: 'select * from "table1" natural full join "table2"'
      }
    )

    support.test(
      'adds a join with a sub query',
      qb().select().from('table1').crossJoin(qb().select().from('table2')),
      {
        pg: 'select * from "table1" cross join (select * from "table2")',
        mysql: 'select * from `table1` cross join (select * from `table2`)',
        mssql: 'select * from [table1] cross join (select * from [table2])',
        sqlite: 'select * from "table1" cross join (select * from "table2")'
      }
    )

    support.test(
      'adds a join with using clause',
      qb().select().from('table1 as t1').leftJoin('table2 as t2').using('some_id'),
      {
        pg: 'select * from "table1" as "t1" left join "table2" as "t2" using ("some_id")',
        mysql: 'select * from `table1` as `t1` left join `table2` as `t2` using (`some_id`)',
        mssql: 'select * from [table1] as [t1] left join [table2] as [t2] using ([some_id])',
        sqlite: 'select * from "table1" as "t1" left join "table2" as "t2" using ("some_id")'
      }
    )

    support.test(
      'adds multiple joins',
      qb().select().from('a').join('b').on('a.id = b.other_id').leftJoin('c').using('some_column'),
      {
        pg: 'select * from "a" inner join "b" on (a.id = b.other_id) left join "c" using ("some_column")',
        mysql: 'select * from `a` inner join `b` on (a.id = b.other_id) left join `c` using (`some_column`)',
        mssql: 'select * from [a] inner join [b] on (a.id = b.other_id) left join [c] using ([some_column])',
        sqlite: 'select * from "a" inner join "b" on (a.id = b.other_id) left join "c" using ("some_column")'
      }
    )

    support.test(
      'supports join precedence',
      qb().select().from(id('a')).leftJoin(table('b').join(id('c')).using('some_id')),
      {
        pg: 'select * from "a" left join ("b" inner join "c" using ("some_id"))',
        mysql: 'select * from `a` left join (`b` inner join `c` using (`some_id`))',
        mssql: 'select * from [a] left join ([b] inner join [c] using ([some_id]))',
        sqlite: 'select * from "a" left join ("b" inner join "c" using ("some_id"))'
      }
    )
  })

  describe('test where():', function () {
    support.test(
      'adds a basic where condition',
      qb().select().from('table').where('id = ?1', 123),
      {
        pg: 'select * from "table" where id = $1',
        mysql: 'select * from `table` where id = ?',
        mssql: 'select * from [table] where id = ?',
        sqlite: 'select * from "table" where id = ?'
      },
      [
        123
      ]
    )

    support.test(
      'adds multiple where conditions',
      qb().select().from('table').where('a = ?', 'x').whereNot('b < ?', 300).orWhere('c like ?', 'zoo%'),
      {
        pg: 'select * from "table" where a = $1 and not (b < $2) or c like $3',
        mysql: 'select * from `table` where a = ? and not (b < ?) or c like ?',
        mssql: 'select * from [table] where a = ? and not (b < ?) or c like ?',
        sqlite: 'select * from "table" where a = ? and not (b < ?) or c like ?'
      },
      [
        'x',
        300,
        'zoo%'
      ]
    )

    support.test(
      'accepts raw expressions by default',
      qb().select().from('table').where('a = ? and b >= ? or c like ?', 'x', 300, 'zoo'),
      {
        pg: 'select * from "table" where a = $1 and b >= $2 or c like $3',
        mysql: 'select * from `table` where a = ? and b >= ? or c like ?',
        mssql: 'select * from [table] where a = ? and b >= ? or c like ?',
        sqlite: 'select * from "table" where a = ? and b >= ? or c like ?'
      },
      [
        'x',
        300,
        'zoo'
      ]
    )

    support.test(
      'accepts plian object expressions',
      qb().select().from('table').where({ a: 123, b: ['foo', 'bar'], c: null }),
      {
        pg: 'select * from "table" where a = $1 and b in ($2, $3) and c is null',
        mysql: 'select * from `table` where a = ? and b in (?, ?) and c is null',
        mssql: 'select * from [table] where a = ? and b in (?, ?) and c is null',
        sqlite: 'select * from "table" where a = ? and b in (?, ?) and c is null'
      },
      [
        123,
        'foo',
        'bar'
      ]
    )

    support.test(
      'accepts sub queries',
      qb().select().from('table').where('key in ?', qb().select('id').from('foo').where({ status: 'active' })),
      {
        pg: 'select * from "table" where key in (select id from "foo" where status = $1)',
        mysql: 'select * from `table` where key in (select id from `foo` where status = ?)',
        mssql: 'select * from [table] where key in (select id from [foo] where status = ?)',
        sqlite: 'select * from "table" where key in (select id from "foo" where status = ?)'
      },
      [
        'active'
      ]
    )

    support.test(
      'accepts exists conditions',
      qb().select().from('table').where('not exists ?', qb().select('id').from('foo').where('status = ?', 'active')),
      {
        pg: 'select * from "table" where not exists (select id from "foo" where status = $1)',
        mysql: 'select * from `table` where not exists (select id from `foo` where status = ?)',
        mssql: 'select * from [table] where not exists (select id from [foo] where status = ?)',
        sqlite: 'select * from "table" where not exists (select id from "foo" where status = ?)'
      },
      [
        'active'
      ]
    )
  })

  describe('test ordeBy():', function () {
    support.test(
      'adds columns to sort with',
      qb().select().from('table').orderBy(1, 'col1', 'col2 desc'),
      {
        pg: 'select * from "table" order by 1, col1, col2 desc',
        mysql: 'select * from `table` order by 1, col1, col2 desc',
        mssql: 'select * from [table] order by 1, col1, col2 desc',
        sqlite: 'select * from "table" order by 1, col1, col2 desc'
      }
    )

    support.test(
      'appends more orders when called multiple times',
      qb().select().from('table').orderBy(1).orderBy('col1').orderBy('col2 desc'),
      {
        pg: 'select * from "table" order by 1, col1, col2 desc',
        mysql: 'select * from `table` order by 1, col1, col2 desc',
        mssql: 'select * from [table] order by 1, col1, col2 desc',
        sqlite: 'select * from "table" order by 1, col1, col2 desc'
      }
    )

    support.test(
      'accepts order expressions',
      qb().select().from(id('table')).orderBy(asc('col1'), desc('col2').nullsFirst()),
      {
        pg: 'select * from "table" order by "col1" asc, "col2" desc nulls first',
        mysql: 'select * from `table` order by `col1` asc, `col2` is null, `col2` desc',
        mssql: 'select * from [table] order by [col1] asc, [col2] is null, [col2] desc',
        sqlite: 'select * from "table" order by "col1" asc, "col2" is null, "col2" desc'
      }
    )
  })

  describe('test limit() and offset():', function () {
    support.test(
      'adds only the limit clause',
      qb().select().from('table').limit(5),
      {
        pg: 'select * from "table" limit $1',
        mysql: 'select * from `table` limit ?',
        mssql: 'select top (?) * from [table]',
        sqlite: 'select * from "table" limit ?'
      },
      [
        5
      ]
    )

    support.test(
      'adds a numeric offset only',
      qb().select().from('users').offset(30),
      {
        pg: 'select * from "users" offset $1',
        mysql: 'select * from `users` limit 18446744073709551615 offset ?',
        mssql: 'select * from [users] order by (select 0) offset ? rows',
        sqlite: 'select * from "users" limit -1 offset ?'
      },
      [
        30
      ]
    )

    support.test(
      'adds both offset and limit clauses',
      qb().select().from('users').limit(3).offset(6).orderBy('pk'),
      {
        pg: 'select * from "users" order by pk limit $1 offset $2',
        mysql: 'select * from `users` order by pk limit ? offset ?',
        sqlite: 'select * from "users" order by pk limit ? offset ?',
        mssql: {
          sql: 'select * from [users] order by pk offset ? rows fetch next ? rows only',
          params: [
            6,
            3
          ]
        }
      },
      [
        3,
        6
      ]
    )
  })

  describe('test groupBy() and having():', function () {
    support.test(
      'adds group by columns',
      qb().select().from('posts').groupBy('col1', id('col2')),
      {
        pg: 'select * from "posts" group by col1, "col2"',
        mysql: 'select * from `posts` group by col1, `col2`',
        mssql: 'select * from [posts] group by col1, [col2]',
        sqlite: 'select * from "posts" group by col1, "col2"'
      }
    )

    support.test(
      'appends more groups when called multiple times',
      qb().select().from('users').groupBy('col1').groupBy(id('col2')),
      {
        pg: 'select * from "users" group by col1, "col2"',
        mysql: 'select * from `users` group by col1, `col2`',
        mssql: 'select * from [users] group by col1, [col2]',
        sqlite: 'select * from "users" group by col1, "col2"'
      }
    )

    support.test(
      'adds a basic having condition',
      qb().select('name', 'count(*) as cnt').from('users').groupBy('name').having('cnt > ?', 5),
      {
        pg: 'select name, count(*) as cnt from "users" group by name having cnt > $1',
        mysql: 'select name, count(*) as cnt from `users` group by name having cnt > ?',
        mssql: 'select name, count(*) as cnt from [users] group by name having cnt > ?',
        sqlite: 'select name, count(*) as cnt from "users" group by name having cnt > ?'
      },
      [
        5
      ]
    )

    support.test(
      'adds a complex having condition',
      qb().select('name', 'min(age)', 'sum(wallet)').from('guys').groupBy('name').having('min(age) not between ? and ?', 14, 21).orHaving({ 'sum(wallet)': [300, 400, 500] }),
      {
        pg: 'select name, min(age), sum(wallet) from "guys" group by name having min(age) not between $1 and $2 or sum(wallet) in ($3, $4, $5)',
        mysql: 'select name, min(age), sum(wallet) from `guys` group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)',
        mssql: 'select name, min(age), sum(wallet) from [guys] group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)',
        sqlite: 'select name, min(age), sum(wallet) from "guys" group by name having min(age) not between ? and ? or sum(wallet) in (?, ?, ?)'
      },
      [
        14,
        21,
        300,
        400,
        500
      ]
    )
  })

  describe('test union():', function () {
    support.test(
      'creates a compound query',
      qb().select().from('foo').union(qb().select().from('bar')),
      {
        pg: 'select * from "foo" union select * from "bar"',
        mysql: 'select * from `foo` union select * from `bar`',
        mssql: 'select * from [foo] union select * from [bar]',
        sqlite: 'select * from "foo" union select * from "bar"'
      }
    )

    support.test(
      'creates a compound query with order by clause',
      qb().select().from('foo').union(qb().select().from('bar')).orderBy('a_col'),
      {
        pg: 'select * from "foo" union select * from "bar" order by a_col',
        mysql: 'select * from `foo` union select * from `bar` order by a_col',
        mssql: 'select * from [foo] union select * from [bar] order by a_col',
        sqlite: 'select * from "foo" union select * from "bar" order by a_col'
      }
    )

    support.test(
      'uses a compound query as a table expression',
      qb().select().from(qb().select().from('foo').union(qb().select().from('bar'))),
      {
        pg: 'select * from (select * from "foo" union select * from "bar")',
        mysql: 'select * from (select * from `foo` union select * from `bar`)',
        mssql: 'select * from (select * from [foo] union select * from [bar])',
        sqlite: 'select * from (select * from "foo" union select * from "bar")'
      }
    )
  })
})
