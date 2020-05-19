import { Provider } from '@client/types'

const ForgeRock: Provider = {
  id: 6,
  title: 'ForgeRock Bank',
  version: '0.0.1',
  logo: 'forgerock'
}

const providerDomain = 'ob.forgerock.financial'

export default {
  provider: ForgeRock,
  authorisationUrl: `https://as.aspsp.${providerDomain}`,
  resourceUrl: `https://matls.rs.aspsp.${providerDomain}`,
  jwkmsUrl: `https://jwkms.${providerDomain}`
}
