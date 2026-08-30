import MoodPicker from './components/MoodPicker.jsx'
import TimeSelector from './components/TimeSelector.jsx'
import NutritionFilters from './components/NutritionFilters.jsx'
import RecipeList from './components/RecipeList.jsx'
import { useMealPlanner } from './hooks/useMealPlanner.js'

export default function App() {
  const { prefs, results, actions } = useMealPlanner()

  return (
    <div className="app">
      <header className="app__header">
        <h1>What should I cook?</h1>
        <p>Pick a mood, tell it how long you have, and set any nutrition needs.</p>
      </header>

      <main className="app__body">
        <form className="planner" onSubmit={(e) => e.preventDefault()}>
          <MoodPicker selected={prefs.moods} onToggle={actions.toggleMood} />
          <TimeSelector minutes={prefs.minutes} onChange={actions.setMinutes} />
          <NutritionFilters
            diets={prefs.diets}
            onToggleDiet={actions.toggleDiet}
            minProtein={prefs.minProtein}
            onMinProtein={actions.setMinProtein}
            maxCalories={prefs.maxCalories}
            onMaxCalories={actions.setMaxCalories}
          />
          <button type="button" className="reset" onClick={actions.reset}>
            Reset
          </button>
        </form>

        <RecipeList results={results} />
      </main>

      <footer className="app__footer">
        <p>
          Recipes live in <code>src/data/recipes.js</code> — add your own any time.
        </p>
      </footer>
    </div>
  )
}
