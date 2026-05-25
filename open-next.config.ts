import type { OpenNextConfig } from '@opennextjs/aws'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare',
      converter: 'edge',
    },
  },
  middleware: {
    external: [],
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
    },
  },
}

export default config
