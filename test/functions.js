/* global describe */

var support = require('./support')
var {
  upper, lower, concat, esc, id, length, replace, substr, trim, rtrim, ltrim,
  left, right, strpos, repeat, space, abs, rand, round, utc, now, today, curtime,
  date, time, day, month, year, hour, minute, second, values
} = require('../lib/helpers')

describe('test SQL functions:', function () {
  support.test(
    'test upper()',
    upper(esc('foo')),
    {
      pg: "upper('foo')",
      mysql: "upper('foo')",
      mssql: "upper('foo')",
      sqlite: "upper('foo')"
    }
  )

  support.test(
    'test lower()',
    lower(id('bar')),
    {
      pg: 'lower("bar")',
      mysql: 'lower(`bar`)',
      mssql: 'lower([bar])',
      sqlite: 'lower("bar")'
    }
  )

  support.test(
    'test concat()',
    concat(id('first_name'), esc(' '), id('last_name')),
    {
      pg: 'concat("first_name", \' \', "last_name")',
      mysql: 'concat(`first_name`, \' \', `last_name`)',
      mssql: 'concat([first_name], \' \', [last_name])',
      sqlite: '"first_name" || \' \' || "last_name"'
    }
  )

  support.test(
    'test length()',
    length(esc('foo')),
    {
      pg: "length('foo')",
      mysql: "length('foo')",
      mssql: "len('foo')",
      sqlite: "length('foo')"
    }
  )

  support.test(
    'test replace()',
    replace(id('id'), esc('foo'), 'bar'),
    {
      pg: "replace(\"id\", 'foo', $1)",
      mysql: "replace(`id`, 'foo', ?)",
      mssql: "replace([id], 'foo', ?)",
      sqlite: "replace(\"id\", 'foo', ?)"
    },
    [ 'bar' ]
  )

  support.test(
    'test substr()',
    substr(id('first_name'), 1, 1),
    {
      pg: 'substr("first_name", $1, $2)',
      mysql: 'substr(`first_name`, ?, ?)',
      mssql: 'substring([first_name], ?, ?)',
      sqlite: 'substr("first_name", ?, ?)'
    },
    [ 1, 1 ]
  )

  support.test(
    'test substr()',
    substr(esc('abcdefgh'), 4),
    {
      pg: "substr('abcdefgh', $1)",
      mysql: "substr('abcdefgh', ?)",
      mssql: "substring('abcdefgh', ?, len('abcdefgh'))",
      sqlite: "substr('abcdefgh', ?)"
    },
    [ 4 ]
  )

  support.test(
    'test trim()',
    trim(id('name')),
    {
      pg: 'trim("name")',
      mysql: 'trim(`name`)',
      mssql: 'rtrim(ltrim([name]))',
      sqlite: 'trim("name")'
    }
  )

  support.test(
    'test rtrim()',
    rtrim(esc('foo  ')),
    {
      pg: "rtrim('foo  ')",
      mysql: "rtrim('foo  ')",
      mssql: "rtrim('foo  ')",
      sqlite: "rtrim('foo  ')"
    }
  )

  support.test(
    'test ltrim()',
    ltrim(id('name')),
    {
      pg: 'ltrim("name")',
      mysql: 'ltrim(`name`)',
      mssql: 'ltrim([name])',
      sqlite: 'ltrim("name")'
    }
  )

  support.test(
    'test left()',
    left(id('first_name'), 3),
    {
      pg: 'left("first_name", $1)',
      mysql: 'left(`first_name`, ?)',
      mssql: 'left([first_name], ?)',
      sqlite: 'substr("first_name", 1, ?)'
    },
    [ 3 ]
  )

  support.test(
    'test right()',
    right(esc('foobar'), 3),
    {
      pg: "right('foobar', $1)",
      mysql: "right('foobar', ?)",
      mssql: "right('foobar', ?)",
      sqlite: "substr('foobar', -?)"
    },
    [ 3 ]
  )

  support.test(
    'test strpos()',
    strpos(id('full_name'), 'foo'),
    {
      pg: 'strpos("full_name", $1)',
      mysql: 'instr(`full_name`, ?)',
      mssql: 'charindex(?, [full_name])',
      sqlite: 'instr("full_name", ?)'
    },
    [ 'foo' ]
  )

  support.test(
    'test repeat()',
    repeat(esc('sql'), 3),
    {
      pg: "repeat('sql', $1)",
      mysql: "repeat('sql', ?)",
      mssql: "replicate('sql', ?)",
      sqlite: "replace(substr(quote(zeroblob((? + 1) / 2)), 3, ?1), '0', 'sql')"
    },
    [ 3 ]
  )

  support.test(
    'test space()',
    space(5),
    {
      pg: "repeat(' ', $1)",
      mysql: 'space(?)',
      mssql: 'space(?)',
      sqlite: "replace(substr(quote(zeroblob((? + 1) / 2)), 3, ?1), '0', ' ')"
    },
    [ 5 ]
  )

  // mathematical functions

  support.test(
    'test rand()',
    rand(),
    {
      pg: 'rand()',
      mysql: 'rand()',
      mssql: 'rand()',
      sqlite: '(random() / 18446744073709551616 + .5)'
    }
  )

  support.test(
    'test abs()',
    abs(-9),
    {
      pg: 'abs($1)',
      mysql: 'abs(?)',
      mssql: 'abs(?)',
      sqlite: 'abs(?)'
    },
    [ -9 ]
  )

  support.test(
    'test round()',
    round(123.4545, 2),
    {
      pg: 'round($1, $2)',
      mysql: 'round(?, ?)',
      mssql: 'round(?, ?)',
      sqlite: 'round(?, ?)'
    },
    [ 123.4545, 2 ]
  )

  // date and time functions

  support.test(
    'test now()',
    now(),
    {
      pg: 'localtimestamp(0)',
      mysql: 'now()',
      mssql: 'cast(getdate() as datetime2(0))',
      sqlite: "datetime('now', 'localtime')"
    }
  )

  support.test(
    'test utc()',
    utc(),
    {
      pg: "current_timestamp(0) at time zone 'UTC'",
      mysql: 'utc_timestamp()',
      mssql: 'cast(getutcdate() as datetime2(0))',
      sqlite: "datetime('now', 'utc')"
    }
  )

  support.test(
    'test today()',
    today(),
    {
      pg: 'current_date',
      mysql: 'current_date()',
      mssql: 'cast(getdate() as date)',
      sqlite: "date('now', 'localtime')"
    }
  )

  support.test(
    'test current_time()',
    curtime(),
    {
      pg: 'current_time(0)',
      mysql: 'current_time()',
      mssql: 'cast(getdate() as time(0))',
      sqlite: "time('now', 'localtime')"
    }
  )

  support.test(
    'test date()',
    date(esc('2017-03-02 09:20:25')),
    {
      pg: "'2017-03-02 09:20:25'::date",
      mysql: "date('2017-03-02 09:20:25')",
      mssql: "cast('2017-03-02 09:20:25' as date)",
      sqlite: "date('2017-03-02 09:20:25')"
    }
  )

  support.test(
    'test time()',
    time(id('created_at')),
    {
      pg: '"created_at"::time(0)',
      mysql: 'time(`created_at`)',
      mssql: 'cast([created_at] as time(0))',
      sqlite: 'time("created_at")'
    }
  )

  support.test(
    'test day()',
    day(esc('2017-03-02 09:20:25')),
    {
      pg: "extract(day from '2017-03-02 09:20:25')",
      mysql: "day('2017-03-02 09:20:25')",
      mssql: "day('2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%d', '2017-03-02 09:20:25') as integer)"
    }
  )

  support.test(
    'test month()',
    month(esc('2017-03-02 09:20:25')),
    {
      pg: "extract(month from '2017-03-02 09:20:25')",
      mysql: "month('2017-03-02 09:20:25')",
      mssql: "month('2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%m', '2017-03-02 09:20:25') as integer)"
    }
  )

  support.test(
    'test year()',
    year(id('purchased_at')),
    {
      pg: 'extract(year from "purchased_at")',
      mysql: 'year(`purchased_at`)',
      mssql: 'year([purchased_at])',
      sqlite: "cast(strftime('%Y', \"purchased_at\") as integer)"
    }
  )

  support.test(
    'test hour()',
    hour(esc('2017-03-02 09:20:25')),
    {
      pg: "extract(hour from '2017-03-02 09:20:25')",
      mysql: "hour('2017-03-02 09:20:25')",
      mssql: "datepart(hour, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%H', '2017-03-02 09:20:25') as integer)"
    }
  )

  support.test(
    'test minute()',
    minute(esc('2017-03-02 09:20:25')),
    {
      pg: "extract(minute from '2017-03-02 09:20:25')",
      mysql: "minute('2017-03-02 09:20:25')",
      mssql: "datepart(minute, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%M', '2017-03-02 09:20:25') as integer)"
    }
  )

  support.test(
    'test second()',
    second(esc('2017-03-02 09:20:25')),
    {
      pg: "extract(second from '2017-03-02 09:20:25')",
      mysql: "second('2017-03-02 09:20:25')",
      mssql: "datepart(second, '2017-03-02 09:20:25')",
      sqlite: "cast(strftime('%S', '2017-03-02 09:20:25') as integer)"
    }
  )

  support.test(
    'test values()',
    values([ 123, 'foo' ]),
    {
      pg: 'values ($1, $2)',
      mysql: 'values (?, ?)',
      mssql: 'values (?, ?)',
      sqlite: 'values (?, ?)'
    },
    [ 123, 'foo' ]
  )

  support.test(
    'test values() with nested data',
    values([1, 'foo'], [2, 'bar'], [3, 'baz']),
    {
      pg: 'values ($1, $2), ($3, $4), ($5, $6)',
      mysql: 'values (?, ?), (?, ?), (?, ?)',
      mssql: 'values (?, ?), (?, ?), (?, ?)',
      sqlite: 'values (?, ?), (?, ?), (?, ?)'
    },
    [ 1, 'foo', 2, 'bar', 3, 'baz' ]
  )

  support.test(
    'test values() with a name',
    values([ 123, 'foo' ]).as('table'),
    {
      pg: '(values ($1, $2)) as "table"',
      mysql: '(values (?, ?)) as `table`',
      mssql: '(values (?, ?)) as [table]',
      sqlite: '(values (?, ?)) as "table"'
    },
    [ 123, 'foo' ]
  )

  support.test(
    'test values() with a name and columns',
    values([1, 'foo'], [2, 'bar'], [3, 'baz']).as('table', 'col1', 'col2'),
    {
      pg: '(values ($1, $2), ($3, $4), ($5, $6)) as "table" ("col1", "col2")',
      mysql: '(values (?, ?), (?, ?), (?, ?)) as `table` (`col1`, `col2`)',
      mssql: '(values (?, ?), (?, ?), (?, ?)) as [table] ([col1], [col2])',
      sqlite: '(values (?, ?), (?, ?), (?, ?)) as "table" ("col1", "col2")'
    },
    [ 1, 'foo', 2, 'bar', 3, 'baz' ]
  )
})
