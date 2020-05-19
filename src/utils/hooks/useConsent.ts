import { useMemo } from 'react'
import { useLocation } from 'routing'

export function useConsent() {
  const location = useLocation()
  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('consent') || null
  }, [location.search])
}
