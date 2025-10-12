export interface Dataset {
  access: number
  coord_sys: string
  data_id: string
  data_max_scale: number
  data_url: string
  file_size: number
  format: string
  funet: string
  license_url: string
  map_sheets: number
  meta: string
  name: string
  name_fin: string
  org: string
  org_abbreviation: string
  queries: boolean
  scale: string
  year: string
  stac_id: string
}

export type DownloadType = 'ZIP' | 'LIST'

export interface NominatimResponse {
  boundingbox: Array<number>
  lon: number
  lat: number
}

export interface JobResponse {
  message: string,
  ID: string,
  progress: number,
  error: string,
}
