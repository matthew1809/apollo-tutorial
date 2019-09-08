import React from "react";
import { useMutation } from "@apollo/react-hooks";

import gql from "graphql-tag";

import Button from "../components/button";
import { GET_LAUNCH } from "./cart-item";

const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function BookTrips({ cartItems }) {
  const [bookTrips, { data, loading, error }] = useMutation(BOOK_TRIPS, {
    refetchQueries: cartItems.map(launchId => ({
      query: GET_LAUNCH,
      variables: { launchId }
    })),
    update(cache) {
      cache.writeData({ data: { cartItems: [] } });
    }
  });

  return data && data.booktrips && !data.booktrips.success ? (
    <p data-testid="message">{data.booktrips.message}</p>
  ) : (
    <Button onClick={bookTrips} data-testid="book-button">
      Book All
    </Button>
  );
}
