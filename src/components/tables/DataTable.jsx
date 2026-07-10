import { useMemo, useState } from 'react'

export function DataTable({ columns, rows, empty = 'No records found', pageSize = 8 }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(columns[0]?.key)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase()
    const filtered = value
      ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(value))
      : rows
    return [...filtered].sort((a, b) => {
      const left = String(a[sortKey] ?? '')
      const right = String(b[sortKey] ?? '')
      return sortDir === 'asc' ? left.localeCompare(right) : right.localeCompare(left)
    })
  }, [query, rows, sortDir, sortKey])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = filteredRows.slice(page * pageSize, page * pageSize + pageSize)

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="data-table-wrap">
      <div className="table-toolbar">
        <input
          value={query}
          placeholder="Search table"
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(0)
          }}
        />
        <span>{filteredRows.length} records</span>
      </div>
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={{ textAlign: column.align || 'left' }}>
                  <button type="button" onClick={() => toggleSort(column.key)}>
                    {column.label}
                    {sortKey === column.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!visibleRows.length && (
              <tr>
                <td colSpan={columns.length}>{empty}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button type="button" disabled={page === 0} onClick={() => setPage((item) => item - 1)}>
          Previous
        </button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <button
          type="button"
          disabled={page + 1 >= pageCount}
          onClick={() => setPage((item) => item + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
