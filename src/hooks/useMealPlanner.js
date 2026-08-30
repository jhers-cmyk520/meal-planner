import { useMemo, useState } from 'react'
import { RECIPES, SIDES } from '../data/recipes.js'
import { recommendMeals } from '../lib/recommend.js'

const toggle = (list, value) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

// Central state for the planner form + the derived ranking.
export function useMealPlanner() {
  const [moods, setMoods] = useState([])
  const [minutes, setMinutes] = useState(45)
  const [diets, setDiets] = useState([])
  const [minProtein, setMinProtein] = useState(null)
  const [maxCalories, setMaxCalories] = useState(null)

  const results = useMemo(
    () =>
      recommendMeals(RECIPES, SIDES, {
        moods,
        minutes,
        diets,
        minProtein,
        maxCalories,
      }),
    [moods, minutes, diets, minProtein, maxCalories],
  )

  return {
    prefs: { moods, minutes, diets, minProtein, maxCalories },
    results,
    actions: {
      toggleMood: (id) => setMoods((m) => toggle(m, id)),
      setMinutes,
      toggleDiet: (id) => setDiets((d) => toggle(d, id)),
      setMinProtein,
      setMaxCalories,
      reset: () => {
        setMoods([])
        setMinutes(45)
        setDiets([])
        setMinProtein(null)
        setMaxCalories(null)
      },
    },
  }
}
