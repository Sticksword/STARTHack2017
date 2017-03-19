import * as fetch from 'isomorphic-fetch';

export interface Destination {
  id: string,
  name: string,
  total_expense: number,
  typical_costs?: {
    [key: string]: number
  }
}

export interface DestinationDetails {
  id: string,
  name: string,
  expenses: {
    [key: string]: number
  },
  top_rated_local_busineses: {
    business_name: string,
    category: string,
    price: number,
    image_url?: string
  }[],
  flights: {
    class: string,
    total_price: string
  }[]
}

export const getDestinations = (persona: string, duration: number, month: number) => {
  let url = `https://start-hack.herokuapp.com/destinations?persona=${persona}&duration=${duration}&month=${month}`
  console.log('Get destinations', url)
  return fetch(url).then((response) => {
    return response.json().then((json) => {
      return json.map((obj: any) => ({
        id: obj.id,
        name: obj.name,
        total_expense: obj.total_expense
      }));
    }) as Promise<Destination[]>;
  }, (error) => {
    console.error(error, error.stack);
    return [];
  });
};

export const getDestaintionDetails = (destination: Destination, persona: string, duration: number, month: number) => {
  let url = `https://start-hack.herokuapp.com/details?destination=${destination.id}&persona=${persona}&duration=${duration}&month=${month}`
  console.log('Get details', url)
  return fetch(url).then((response) => {
    return response.json() as Promise<DestinationDetails>;
  }, (error) => {
    console.error(error, error.stack);
    return null;
  });
};

export const getBankAccountInfo = () => {
  let url = `https://start-hack.herokuapp.com/bankAccountInfo`
  console.log('Get bank account info', url)
  return fetch(url).then((response) => {
    return response.json().then(json => json.balance )
  }, (error) => {
    console.error(error, error.stack);
    return null;
  });
};
