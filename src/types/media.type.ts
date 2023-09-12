import { SuccessResponse } from './utils.type';

// Type: Media
export interface Media {
  id: string;
  name: string;
  url: string;
  type: number;
}

// Response: Tải lên media mới
export type UploadMediaResponse = SuccessResponse<{
  medias: Media[];
}>;
