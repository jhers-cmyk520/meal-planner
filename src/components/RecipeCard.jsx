function Macros({ nutrition, label }) {
  return (
    <dl className="macros">
      <div>
        <dt>kcal</dt>
        <dd>{nutrition.calories}</dd>
      </div>
      <div>
        <dt>protein</dt>
        <dd>{nutrition.protein}g</dd>
      </div>
      <div>
        <dt>carbs</dt>
        <dd>{nutrition.carbs}g</dd>
      </div>
      <div>
        <dt>fat</dt>
        <dd>{nutrition.fat}g</dd>
      </div>
      <div>
        <dt>fiber</dt>
        <dd>{nutrition.fiber}g</dd>
      </div>
      {label ? <p className="macros__label">{label}</p> : null}
    </dl>
  )
}

export default function RecipeCard({ result, rank }) {
  const { recipe, reasons, sides, suggestedSides, plateNutrition } = result
  const suggestedIds = new Set(suggestedSides.map((s) => s.id))

  return (
    <article className={rank === 0 ? 'card card--top' : 'card'}>
      <header className="card__head">
        <div>
          {rank === 0 ? <p className="card__badge">Top pick</p> : null}
          <h3>{recipe.name}</h3>
          <p className="card__meta">
            {recipe.cuisine} &middot; {recipe.minutes} min &middot; {recipe.effort} &middot; serves{' '}
            {recipe.servings}
          </p>
        </div>
      </header>

      {reasons.length ? (
        <ul className="reasons">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}

      <section className="card__section">
        <h4>Plate nutrition (main + suggested sides)</h4>
        <Macros nutrition={plateNutrition} />
      </section>

      <section className="card__section">
        <h4>Sides that pair well</h4>
        <ul className="sides">
          {sides.slice(0, 4).map(({ side, reasons: sideReasons, fit }) => (
            <li
              key={side.id}
              className={suggestedIds.has(side.id) ? 'side side--picked' : 'side'}
            >
              <span className="side__name">
                {suggestedIds.has(side.id) ? '✓ ' : ''}
                {side.name}
              </span>
              <span className="side__meta">
                {side.minutes} min{sideReasons.length ? ` · ${sideReasons.join(', ')}` : ''}
                {fit <= 0 ? ' · tight on time' : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <details className="card__section">
        <summary>Ingredients & method</summary>
        <p className="ingredients">{recipe.mainIngredients.join(', ')}</p>
        <ol className="steps">
          {recipe.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
    </article>
  )
}
