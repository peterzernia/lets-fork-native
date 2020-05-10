import Constants from 'expo-constants'

const ENV = {
  development: {
    ADS: true,
    API: 'http://192.168.178.25:8003/api/v1',
    WS: 'ws://192.168.178.25:8003/api/v1/ws',
  },
  production: {
    ADS: true,
    API: 'https://letsfork.peterzernia.com/api/v1',
    WS: 'wss://letsfork.peterzernia.com/api/v1/ws',
  },
}

const getEnvVars = (releaseChannel: string | undefined): typeof ENV.development => {
  if (releaseChannel === undefined) return ENV.development
  if (releaseChannel.indexOf('production') !== -1) return ENV.production
  return ENV.development
}

export default getEnvVars(Constants.manifest.releaseChannel)
