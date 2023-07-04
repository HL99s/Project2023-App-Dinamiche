import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {NgModule} from '@angular/core';
import {InMemoryCache} from '@apollo/client/core';
import {setContext} from "apollo-link-context";
import {ApolloLink,} from "apollo-link";

const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): { cache: InMemoryCache; link: ApolloLink } {

  const token = localStorage.getItem("token");

  // @ts-ignore
  const auth = setContext((operation, context) => {
    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  // @ts-ignore
  const link = ApolloLink.from([auth, httpLink.create({uri})]);

  return {
    link: link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
