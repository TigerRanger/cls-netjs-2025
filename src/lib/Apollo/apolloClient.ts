import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.MAGENTO_ENDPOINT,
  cache: new InMemoryCache(),
});

export default client;


