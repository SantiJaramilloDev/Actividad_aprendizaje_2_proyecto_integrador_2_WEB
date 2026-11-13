function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, fila) => (
        <tr key={fila} aria-hidden="true">
          {Array.from({ length: columns }).map((__, columna) => (
            <td key={columna}>
              <span className={`skeleton skeleton-line skeleton-w-${(columna % 3) + 1}`}></span>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton
