import { SuccessResponse } from './utils.type';

export interface Media {
  name: string;
  url: string;
  type: number;
}

export type UploadMediaResponse = SuccessResponse<{
  medias: Media[];
}>;
