import { UploadMediaResponse } from 'src/types/media.type';
import http from 'src/utils/http';

const URL_UPLOAD_IMAGE = '/medias/upload-image';

const mediaApi = {
  uploadImage(body: FormData) {
    return http.post<UploadMediaResponse>(URL_UPLOAD_IMAGE, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default mediaApi;
