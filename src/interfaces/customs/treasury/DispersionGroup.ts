export interface IDispersionGroup {
  id: number;
  business: unknown;
  business_name: unknown;
  bank: unknown;
  bank_name: unknown;
  account: unknown;
  dispersion_group: unknown;
  validity: unknown;
  state: unknown;
  turns: unknown;
  response_state: unknown;
  approval_status: unknown;
}
export interface IDataFilter {
  name: string;
  value: string | number | Date | null;
}
export interface IDispersionGroupInformationForm {
  id: string;
  business_name:string;
  bank_name: string;
  account:string;
  dispersion_group: string;
  validity: string;
}

export interface IDispersionGroupDetailsTable {
  id: number;
  business: unknown;
  bank: unknown;
  bank_name: unknown;
  account: unknown;
  dispersion_group: unknown;
  date: unknown;
  concept: unknown;
  value: unknown;
  third: unknown;
}
export interface IDispersionGroupInfo {
  id: number;
  business: unknown;
  bank: unknown;
  bank_name: unknown;
  account: unknown;
  dispersion_group: unknown;
  date: unknown;
  concept: unknown;
  value: unknown;
  third: unknown;
}

export interface IFilterConfigOptions {
  value: string;
  label: string;
}
export interface IFilterConfig {
  name: string;
  label: string;
  type: string;
  value: string | null;
  class: string;
  options?: IFilterConfigOptions[];
  disable: boolean;
  clean_value: boolean;
  placeholder: string;
  hide?: boolean;
  rules?: ((val: string) => true | string)[] | [];
  prepend_icon?: string;
}
