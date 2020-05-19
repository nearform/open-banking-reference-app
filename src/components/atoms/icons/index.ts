import Budget from './budget'
import Chevron from './chevron'
import Checked from './checked'
import Clothing from './clothing'
import Down from './down'
import Home from './home'
import Menu from './menu'
import Messages from './messages'
import Mic from './mic'
import PinBack from './pin-back'
import Search from './search'
import TouchId from './touch-id'
import Transfer1 from './transfer-1'
import Transfer2 from './transfer-2'
import Transfer3 from './transfer-3'
import Transfer4 from './transfer-4'
import Transfer5 from './transfer-5'
import Transfer6 from './transfer-6'
import X from './x'
import Polaris from './polaris'
import Plus from './plus'
import Money from './money'
import Logo from './logo'
import Bot from './bot'
import QuestionMark from './question-mark'
import OpenBanking from './open-banking'
import BarcodeQR from './barcode-qr'
import { IconProps } from './common'

const icons: { name: string; icon: React.ComponentType<IconProps> }[] = [
  {
    name: 'ic-budget',
    icon: Budget
  },
  {
    name: 'ic-chevron',
    icon: Chevron
  },
  {
    name: 'ic-checked',
    icon: Checked
  },
  {
    name: 'ic-clothing',
    icon: Clothing
  },
  {
    name: 'ic-down',
    icon: Down
  },
  {
    name: 'ic-home',
    icon: Home
  },
  {
    name: 'ic-menu',
    icon: Menu
  },
  {
    name: 'ic-messages',
    icon: Messages
  },
  {
    name: 'ic-mic',
    icon: Mic
  },
  {
    name: 'ic-pin-back',
    icon: PinBack
  },
  {
    name: 'ic-search',
    icon: Search
  },
  {
    name: 'ic-touch-id',
    icon: TouchId
  },
  {
    name: 'ic-transfer-1',
    icon: Transfer1
  },
  {
    name: 'ic-transfer-2',
    icon: Transfer2
  },
  {
    name: 'ic-transfer-3',
    icon: Transfer3
  },
  {
    name: 'ic-transfer-4',
    icon: Transfer4
  },
  {
    name: 'ic-transfer-5',
    icon: Transfer5
  },
  {
    name: 'ic-transfer-6',
    icon: Transfer6
  },
  {
    name: 'ic-x',
    icon: X
  },
  {
    name: 'ic-plus',
    icon: Plus
  },
  {
    name: 'ic-money',
    icon: Money
  },
  {
    name: 'ic-logo',
    icon: Logo
  },
  {
    name: 'bot-avatar',
    icon: Bot
  },
  {
    name: 'question-mark',
    icon: QuestionMark
  },
  {
    name: 'ic-polaris',
    icon: Polaris
  },
  {
    name: 'open-banking',
    icon: OpenBanking
  },
  {
    name: 'barcode-qr',
    icon: BarcodeQR
  }
]

export default icons
