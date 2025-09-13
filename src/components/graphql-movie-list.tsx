"use client";

import { formatDate } from "@/lib/utils";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_LOCATIONS = gql`
  query MyQuery {
    hello
  }
`;
export const GET_MOVIES = gql`
  query MyQuery {
    movies(lang: UK, sortBy: RATING, sortOrder: ASC) {
      items {
        title
        rating
        duration
        key
        mainGenre
        poster
        releaseDate
      }
    }
  }
`;

export const GraphQLMovieList = () => {
  const { loading, error, data } = useQuery(GET_LOCATIONS);
  const { loading: l, error: e, data: items } = useQuery(GET_MOVIES);

  console.log("data:", l, data);

  if (l) {
    return <div>Loaded</div>;
  }

  return (
    <div>
      <h1>GraphQL Movie List</h1>
      {(items as any).movies.items.map((movie: any) => (
        <div className="mb-2 border" key={movie.key}>
          <h2>{movie.title}</h2>
          <p>Rating: {movie.rating}</p>
          <p>Duration: {movie.duration} minutes</p>
          <p>Main Genre: {movie.mainGenre}</p>
          <p>Release Date: {formatDate(movie.releaseDate)}</p>
        </div>
      ))}
    </div>
  );
};
