import { GetNotificationsRequestParams, GetNotificationsResponse } from 'src/types/notification.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const notificationApi = {
  // Lấy danh sách thông báo
  getNotifications(params?: GetNotificationsRequestParams) {
    return http.get<GetNotificationsResponse>('/notifications', { params });
  },
  // Xóa thông báo
  deleteNotifications(notificationId?: string) {
    return http.delete<OnlyMessageResponse>(`/notifications/${notificationId || ''}`);
  },
  // Đọc thông báo
  readNotifications(notificationId?: string) {
    return http.patch<OnlyMessageResponse>(`/notifications/${notificationId || ''}`);
  }
};

export default notificationApi;
