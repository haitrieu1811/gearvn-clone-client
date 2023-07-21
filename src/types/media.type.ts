import { SuccessResponse } from './utils.type';

export interface Media {
  id: string;
  name: string;
  url: string;
  type: number;
}

export type UploadMediaResponse = SuccessResponse<{
  medias: Media[];
}>;
