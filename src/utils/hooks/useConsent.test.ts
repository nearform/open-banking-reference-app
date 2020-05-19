import { renderHook } from '@testing-library/react-hooks'
import * as routing from 'routing'
import { useConsent } from '.'

jest.mock('routing')
const mockedRouting = routing as jest.Mocked<typeof routing>

test('useConsent with no URL parameters', () => {
  mockedRouting.useLocation.mockReturnValueOnce({} as any)

  const { result } = renderHook(() => useConsent())
  expect(result.current).toBe(null)
})

test('useConsent with no consent parameter', () => {
  mockedRouting.useLocation.mockReturnValueOnce({ search: '?account=123' } as any)

  const { result } = renderHook(() => useConsent())
  expect(result.current).toBe(null)
})

test('useConsent with consent parameter', () => {
  const consent = '54fe-124a-bc57'
  mockedRouting.useLocation.mockReturnValueOnce({ search: `?account=123&consent=${consent}` } as any)

  const { result } = renderHook(() => useConsent())
  expect(result.current).toEqual(consent)
})
