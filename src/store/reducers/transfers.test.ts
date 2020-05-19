import reducer from './transfers'

test('set transfer institution', () => {
  expect(
    reducer(
      {
        amount: '',
        institution: null
      },
      {
        type: 'SET_TRANSFER_INSTITUTION',
        payload: {
          full_name: 'Institution 1',
          id: 'institution-1',
          media: [
            {
              source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
              type: 'icon'
            },
            {
              source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
              type: 'logo'
            }
          ],
          name: 'Inst 1'
        }
      }
    )
  ).toEqual({
    amount: '',
    institution: {
      full_name: 'Institution 1',
      id: 'institution-1',
      media: [
        {
          source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
          type: 'icon'
        },
        {
          source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
          type: 'logo'
        }
      ],
      name: 'Inst 1'
    }
  })
})

test('set transfer amount', () => {
  expect(
    reducer(
      {
        amount: '',
        institution: null
      },
      {
        type: 'SET_TRANSFER_AMOUNT',
        payload: '999.99'
      }
    )
  ).toEqual({
    amount: '999.99',
    institution: null
  })
})

test('reset transfer', () => {
  expect(
    reducer(
      {
        amount: '10',
        institution: {
          full_name: 'Institution 1',
          id: 'institution-1',
          media: [
            {
              source: 'https://images.yapily.com/image/bfa8938c-75f4-4304-9056-377e8b79923d?size=0',
              type: 'icon'
            },
            {
              source: 'https://images.yapily.com/image/f8d7f1a0-c4da-4768-b5c2-a9835624f905?size=0',
              type: 'logo'
            }
          ],
          name: 'Inst 1'
        }
      },
      {
        type: 'RESET_TRANSFER'
      }
    )
  ).toEqual({
    amount: '',
    institution: null
  })
})
