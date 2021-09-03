import { queries as masterDataQueries } from './masterData'
import { queries as omsQueries } from './oms'

export const resolvers = {
  Query: {
    ...masterDataQueries,
    ...omsQueries,
  },
}
