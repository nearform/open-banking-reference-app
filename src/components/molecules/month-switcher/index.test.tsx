import React from 'react'

import MonthSwitcher from './'
import { render, fireEvent } from 'test-utils'

const stubProps = {
  onSelect: jest.fn(),
  currentMonth: 9
}

test('Month switcher', () => {
  const { getByTestId } = render(<MonthSwitcher {...stubProps} />)

  // ensure chosen month is highlighted
  // @TODO - a snapshot would be better than testing a specific style here
  expect(getByTestId('months:9')).toHaveStyle({ backgroundColor: '#2165E2' })

  // choose a different month
  fireEvent.press(getByTestId('months:1'))

  // ensure onSelect is called with correct month
  expect(stubProps.onSelect).toHaveBeenCalledWith(1)
})
