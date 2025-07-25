// apolloClient.js
"use client";
import { getSession } from "@/app/actions";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";


console.log('Initializing Apollo Client', process.env.NEXT_PUBLIC_BACKEND_URL + "/procheDeMoi");

// Create an HTTP link pointing to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL + "/procheDeMoi",
  // credentials: "include", // Sends cookies with every request
});

// Create an auth link to attach the token
const authLink = setContext(async (_, { headers }) => {
  console.log('headers', headers);
  // Example: retrieve token from localStorage, or from a global variable you set from session
  // If you used iron-session on the server, you can pass the token to your client via getServerSideProps
  const session = await getSession();
  return {
    headers: {
      ...headers,
      authorization: session.token ? `Bearer ${session.token}` : "",
    },
  };
});

// Instantiate the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;