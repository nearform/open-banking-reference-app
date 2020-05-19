import Abanca from './abanca'
import BancoSantander from './bancosantander'
import BBVA from './bbva'
import CaixaBank from './caixabank'
import DeutscheBank from './deutschebank'
import ForgeRock from './forgerock'
import Ibercaja from './ibercaja'
import { BankProvider } from '../../../../types'

const providers: BankProvider[] = [Abanca, BancoSantander, BBVA, CaixaBank, DeutscheBank, ForgeRock, Ibercaja]

export default providers
