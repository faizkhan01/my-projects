export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  emoji: string;
}

export interface State {
  name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  type: string;
}

export interface CountryWithStates extends Country {
  states: State[];
}
