const config = {
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
