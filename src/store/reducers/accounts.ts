import { AccountsAction } from '../actions/accounts'
import { Account } from '../../types'

const INITIAL_STATE = {
  active: 'b6623176-e165-496b-a041-2df362a262c9',
  accounts: [
    {
      accountNumber: '2529110778760',
      balance: '9295.55',
      currency: 'GBP',
      id: 'b6623176-e165-496b-a041-2df362a262c9',
      provider: 6,
      subType: 'CurrentAccount',
      title: 'Current Account',
      type: 'Personal',
      transactions: [
        {
          amount: '-156.44',
          currency: 'GBP',
          date: '2018-11-03T09:30:39.919Z',
          icon: 'spotify',
          title: 'Cash to Ratliff, Jamal J.'
        },
        {
          amount: '105.21',
          currency: 'GBP',
          date: '2018-11-07T12:19:41.919Z',
          icon: 'fitness',
          title: 'Cash from Franklin, Abdul Z.'
        },
        {
          amount: '-370.72',
          currency: 'GBP',
          date: '2018-11-11T21:10:22.919Z',
          icon: 'clothing',
          title: 'Cash to Glover, Lara R.'
        },
        {
          amount: '102.74',
          currency: 'GBP',
          date: '2018-11-12T12:33:24.919Z',
          icon: 'starbucks',
          title: 'Cash from Hebert, Cally W.'
        },
        {
          amount: '-405.87',
          currency: 'GBP',
          date: '2018-11-15T00:53:32.919Z',
          icon: 'amazon',
          title: 'Cash to Mccray, Zena K.'
        },
        {
          amount: '257.27',
          currency: 'GBP',
          date: '2018-11-15T04:06:02.919Z',
          icon: 'starbucks',
          title: 'Cash from Burch, Bruno K.'
        },
        {
          amount: '-81.79',
          currency: 'GBP',
          date: '2018-11-15T18:41:25.919Z',
          icon: 'spotify',
          title: 'Cash to Mcleod, Kellie I.'
        },
        {
          amount: '-395.94',
          currency: 'GBP',
          date: '2018-11-16T18:53:14.919Z',
          icon: 'starbucks',
          title: 'Cash to Mccray, Zena K.'
        },
        {
          amount: '39.63',
          currency: 'GBP',
          date: '2018-11-21T00:09:40.919Z',
          icon: 'clothing',
          title: 'Cash from Dejesus, Amir O.'
        },
        {
          amount: '82.15',
          currency: 'GBP',
          date: '2018-11-21T11:47:33.919Z',
          icon: 'tap',
          title: 'Cash from Dunn, Knox T.'
        }
      ]
    }
  ] as Account[],
  lastUpdated: null as number | null
}

export type AccountsState = typeof INITIAL_STATE

export default function (state = INITIAL_STATE, action: AccountsAction): AccountsState {
  let newAccounts: Account[], newAccountsLn
  switch (action.type) {
    case 'ADD_OPENBANKING_ACCOUNT':
      return {
        ...state,
        active: 'ob',
        accounts: state.accounts.some(acc => acc.id === 'ob')
          ? state.accounts
          : [
              ...state.accounts.slice(0, 2),
              {
                id: 'ob',
                title: 'Open Santander',
                balance: '345,78',
                type: 'Open banking',
                accountNumber: 'PT48SANT123456192837465',
                icon: require(`../../assets/logos/santander-red.png`)
              },
              ...state.accounts.slice(2)
            ]
      }

    case 'SELECT_ACCOUNT':
      return {
        ...state,
        active: action.payload
      }

    case 'LOAD_ACCOUNTS':
      const currentAccounts = state.accounts
      newAccounts = action.payload
      newAccountsLn = newAccounts.length
      if (currentAccounts.length) {
        // get current balances and transactions
        newAccounts.forEach((a, i) => {
          const foundAccount = currentAccounts.find(e => e.id === a.id)
          if (foundAccount) {
            newAccounts[i].balance = foundAccount.balance
            newAccounts[i].transactions = foundAccount.transactions
          }
        })
      }
      // Sort accounts by Provider DESC, Title Desc
      newAccounts.sort((_, b) => b.provider! - b.provider!)
      const accountsByProvider: { [key: number]: Account[] } = {}
      newAccounts.forEach(a => {
        if (!accountsByProvider[a.provider!]) {
          accountsByProvider[a.provider!] = []
        }
        accountsByProvider[a.provider!].push(a)
      })
      let accountsSorted: Account[] = []
      for (const provider in accountsByProvider) {
        const thisAccounts = accountsByProvider[provider]
        thisAccounts.sort((a, b) => a.title.localeCompare(b.title))
        accountsSorted = accountsSorted.concat(thisAccounts)
      }
      let newActive = ''
      if (currentAccounts.length) {
        newActive = state.active
      } else if (accountsSorted.length) {
        newActive = accountsSorted[0].id
      }
      return {
        ...state,
        active: newActive,
        accounts: accountsSorted,
        lastUpdated: Date.now()
      }

    case 'UPDATE_ACCOUNT':
      newAccounts = state.accounts.slice(0)
      newAccountsLn = newAccounts.length
      for (let i = 0; i < newAccountsLn; i++) {
        if (newAccounts[i].id === action.payload.id) {
          newAccounts[i][action.payload.property] = action.payload.value as never
          break
        }
      }
      return {
        ...state,
        accounts: newAccounts
      }

    default:
      return state
  }
}
