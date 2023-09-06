import { AddNotificationRequestBody, GetNotificationsResponse } from 'src/types/notification.type';
import { OnlyMessageResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

const notificationApi = {
  // Thêm một thông báo mới đến những người dùng có quyền quản trị
  addNotification(body: AddNotificationRequestBody) {
    return http.post<OnlyMessageResponse>('/notifications', body);
  },
  // Lấy danh sách thông báo
  getNotifications() {
    return http.get<GetNotificationsResponse>('/notifications');
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