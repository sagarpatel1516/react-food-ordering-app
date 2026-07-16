export interface Position {
  latitude: number;
  longitude: number;
}

export interface AddressResponse {
  locality?: string;
  city?: string;
  postcode?: string;
  countryName?: string;
  principalSubdivision?: string;
  countryCode?: string;
}

export async function getAddress({
  latitude,
  longitude,
}: Position): Promise<AddressResponse> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`,
  );

  if (!res.ok) {
    throw new Error("Failed getting address");
  }

  const data: AddressResponse = await res.json();

  return data;
}