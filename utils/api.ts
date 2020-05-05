import ky from 'ky'
import { Restaurant } from 'types'

const api = ky.create({ prefixUrl: 'http://192.168.178.25:8003/api/v1/' })

// eslint-disable-next-line import/prefer-default-export
export const getRestaurant = (id: string): Promise<Restaurant> => api.get(`restaurants/${id}`).json()
