namespace Models {
  interface Contact {
    id: string;
    name: PersonName;
    communication: Communication;
  }

  interface PersonName {
    honorific?: Honorific;
    givenName: string;
    familyName: string;
    suffix?: PersonNameSuffix;
  }

  interface Communication {
    email?: Email;
    phone: PhoneNumber;
    address?: Address;
    website?: Website;
  }

  interface Email {
    user: string;
    domain: string;
    tld?: string;
  }

  interface Website {
    domain: string;
    tld?: string;
  }

  interface PhoneNumber {
    country?: number;
    area: number;
    no: number;
    ext?: number;
  }

  interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: number;
    county: string;
  }

  interface Response {
    statusCode: number;
    body?: string | any;
  }

  enum Honorific {
    Mr,
    Miss,
    Mrs,
    Ms,
    Mx,
    Dr,
    Prof
  }

  enum PersonNameSuffix {
    I,
    II,
    III,
    IV,
    V,
    Jr,
    Sr,
    MD,
    DDS,
    DVM,
    PhD
  }
}
