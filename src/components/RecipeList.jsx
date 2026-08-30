import RecipeCard from './RecipeCard.jsx'

export default function RecipeList({ results }) {
  const viable = results.filter((r) => r.score > 0)
  const shown = viable.length ? viable : results.slice(0, 3)

  return (
    <section className="results">
      <h2>
        {viable.length
          ? `${viable.length} meal${viable.length === 1 ? '' : 's'} fit tonight`
          : 'Nothing fits perfectly — closest matches:'}
      </h2>
      <div className="results__grid">
        {shown.map((result, i) => (
          <RecipeCard key={result.recipe.id} result={result} rank={i} />
        ))}
      </div>
    </section>
  )
}
