import { useEffect, useState } from 'react'

import { getFormOptions } from '../api/formOptions.js'

// Loads all form option groups (age, gender, role, eventDate, occasion,
// guests, budget, suppliers, discoveryChannel, lumiPromos, ...) with a
// single request, instead of one request per <select>/checklist. Fetched
// once at the page level (EventFormPage) and passed down as props to
// BasicInfoSection and PurposeOfVisitSection, the same way
// usePhilippineAddress's region/province/city/barangay state is shared.
export function useFormOptions() {
  const [optionGroups, setOptionGroups] = useState(null) // null while unloaded
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getFormOptions()
      .then((json) => {
        if (cancelled) return
        if (json?.success) {
          setOptionGroups(json.data)
        } else {
          setError('Failed to load form options.')
        }
      })
      .catch((err) => {
        console.error('Failed to fetch form options:', err)
        if (!cancelled) setError('Failed to load form options.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Helper: pull one group's plain-string value list, safe before load
  // completes. Falls back to `[]` rather than throwing on undefined, so
  // consuming <FormSelect> components render an empty (loading) list
  // instead of crashing while optionGroups is still null.
  function getGroupValues(groupName) {
    return (optionGroups?.[groupName] ?? []).map((opt) => opt.value)
  }

  // Helper: resolve the literal string that represents "Other" for a
  // given group, driven by the API's `isOther` flag rather than a
  // hardcoded 'Other' string scattered across components. Falls back to
  // 'Other' if the group hasn't loaded yet or no option is flagged, so
  // existing behavior is preserved during the loading window.
  function getOtherValue(groupName) {
    const match = (optionGroups?.[groupName] ?? []).find((opt) => opt.isOther)
    return match?.value ?? 'Other'
  }

  return { optionGroups, loading, error, getGroupValues, getOtherValue }
}