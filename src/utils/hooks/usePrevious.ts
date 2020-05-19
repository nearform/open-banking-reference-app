import { useEffect, useRef } from 'react'

/**
 * Track value changes using a reference, as described in React documentation.
 * It is possible to initialize reference with provided value.
 *
 * @see https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * @param value T - value stored and tracked
 * @param useInitial [boolean = false] - unless true, tracked value will be null
 * @returns value tracked, initially null, unless `useInitial` is true
 * @template T
 */
export function usePrevious<T>(value: T, useInitial = false) {
  const ref = useRef<T | null>(useInitial ? value : null)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
