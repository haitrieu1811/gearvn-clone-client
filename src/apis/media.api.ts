import { UploadMediaResponse } from 'src/types/media.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const URL_UPLOAD_IMAGE = '/medias/upload-image';

const mediaApi = {
  // Tải ảnh lên server
  uploadImage(body: FormData) {
    return http.post<UploadMediaResponse>(URL_UPLOAD_IMAGE, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  // Xóa ảnh khỏi S3 và thông tin ảnh khỏi DB
  deleteMedia(media_ids: string[]) {
    return http.delete<OnlyMessageResponse>('/medias', { data: { media_ids } });
  }
};

export default mediaApi;
