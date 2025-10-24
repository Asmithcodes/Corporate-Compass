export enum CompanyStatus {
  ESTABLISHED = 'Established',
  UNDER_DEVELOPMENT = 'Under Development',
  ABOUT_TO_START = 'About to Start',
  PROPOSED_INVESTMENT = 'Proposed Investment',
}

export interface Company {
  name: string;
  status: CompanyStatus | string;
  location: string;
  description: string;
  investment?: string;
  website?: string;
  googleMapsUrl?: string;
  employeeCount?: number | string;
  establishedYear?: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}