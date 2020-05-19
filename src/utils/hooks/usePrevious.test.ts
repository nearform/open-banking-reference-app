import { renderHook, act } from '@testing-library/react-hooks'
import { usePrevious } from '.'

test('usePrevious with initial value', () => {
  const value = { foo: 'bar' }
  const { result, rerender } = renderHook(() => usePrevious(value, true))
  expect(result.current).toEqual(value)
  rerender()
  expect(result.current).toEqual(value)
})

test('usePrevious without initial value', () => {
  const value = { foo: 'bar' }
  const { result, rerender } = renderHook(() => usePrevious(value))
  expect(result.current).toEqual(null)
  rerender()
  expect(result.current).toEqual(value)
})

test('usePrevious with changing value', () => {
  const value = { foo: 'bar' }
  const newValue = { foo: 'baz' }
  const { result, rerender } = renderHook(() => usePrevious(value, true))
  expect(result.current).toEqual(value)

  act(() => {
    value.foo = newValue.foo
  })
  expect(result.current).toEqual(newValue)
  rerender()
  expect(result.current).toEqual(newValue)
})
