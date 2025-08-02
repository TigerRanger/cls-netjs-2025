import { ApolloClient, InMemoryCache } from '@apollo/client';

const clientwp = new ApolloClient({
  uri: process.env.WP_ENDPOINT,
  cache: new InMemoryCache(),
});

export default clientwp;


