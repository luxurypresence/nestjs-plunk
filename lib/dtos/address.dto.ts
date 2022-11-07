export interface Address {
  streetPreDirection: string;
  streetPostDirection: string;
  secondaryDesignator: string;
  primaryNumber: string;
  streetName: string;
  streetSuffix: string;
  secondaryNumber: string;
  parcelId: string;
  cityName: string;
  stateCode: string;
  zipCode: string;
}

export interface AddressesResponse {
  hits: { address: Address }[];
}
