export interface Address {
  parcelId: string;
  fips: string;
  apn: string;
  alternateApn: string;
  primaryNumber: string;
  streetPreDirection: string;
  streetName: string;
  streetSuffix: string;
  streetPostDirection: string;
  secondaryDesignator: string;
  secondaryNumber: string;
  cityName: string;
  stateCode: string;
  zipCode: string;
}

export interface AddressesResponse {
  hits: { address: Address }[];
}
