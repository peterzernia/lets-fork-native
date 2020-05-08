import Constants from 'expo-constants'

const ENV = {
  dev: {
    WS: 'ws://192.168.178.25:8003/api/v1/ws',
    API: 'http://192.168.178.25:8003/api/v1',
  },
  prod: {
    WS: 'ws://192.168.178.25:8003/api/v1/ws',
    API: 'http://192.168.178.25:8003/api/v1',
  },
}

// eslint-disable-next-line
const getEnvVars = (env = '') => {
  if (env.indexOf('prod') !== -1) return ENV.prod
  return ENV.dev
}

export default getEnvVars(Constants.manifest.releaseChannel)
