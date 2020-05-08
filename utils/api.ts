import ky from 'ky'
import env from 'env'
import { Restaurant } from 'types'

const api = ky.create({ prefixUrl: env.API })

// eslint-disable-next-line import/prefer-default-export
export const getRestaurant = (id: string): Promise<Restaurant> => api.get(`restaurants/${id}`).json()
