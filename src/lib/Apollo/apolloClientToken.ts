import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Replace this with your GraphQL endpoint
const GRAPHQL_API_URL = process.env.MAGENTO_ENDPOINT;

const httpLink = new HttpLink({
  uri: GRAPHQL_API_URL,
});

// Middleware to attach the Bearer token
const authLink = setContext((_, { headers }) => {
  // Retrieve the token from localStorage or cookies
  let token = process.env.NEXTJS_SECRET_KEY;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') ?? undefined; // Or your preferred storage
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
