import {
  queries as masterDataQueries,
  mutations as masterDataMutations,
} from './masterData'
import { queries as omsQueries, mutations as omsMutations } from './oms'

export const resolvers = {
  Query: {
    ...masterDataQueries,
    ...omsQueries,
  },
  Mutation: {
    ...omsMutations,
    ...masterDataMutations,
  },
}
