"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

export const client = new ApolloClient({
  link: new HttpLink({ uri: "http://127.0.0.1:5002/graphql" }),
  cache: new InMemoryCache(),
});

export const GraphQLProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
