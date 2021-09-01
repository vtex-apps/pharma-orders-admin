import { queries as catalogSystemQueries } from './catalogSystem'

export const resolvers = {
  Query: {
    ...catalogSystemQueries,
  },
}
