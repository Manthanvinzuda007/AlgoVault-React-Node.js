export function DifficultyBadge({ difficulty }) {
  const d = difficulty?.toLowerCase()
  return (
    <span className={`badge badge-${d}`}>
      {difficulty}
    </span>
  )
}
