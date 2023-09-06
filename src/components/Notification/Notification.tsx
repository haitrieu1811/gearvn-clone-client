import { useMutation, useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import notificationApi from 'src/apis/notification.api';
import socket from 'src/utils/socket';
import { convertMomentFromNowToVietnamese, getImageUrl } from 'src/utils/utils';
import { BellIcon, EllipsisHorizontalIcon, EmptyImage } from '../Icons';

const Notification = () => {
  // Query lấy danh sách thông báo
  const getNotificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications()
  });

  // Socket lắng nghe sự kiện có thông báo mới
  useEffect(() => {
    socket.on('receive_notification', () => {
      getNotificationsQuery.refetch();
    });
  }, []);

  // Danh sách thông báo
  const notifications = useMemo(
    () => getNotificationsQuery.data?.data.data.notifications,
    [getNotificationsQuery.data?.data.data.notifications]
  );
  // Số lượng thông báo chưa đọc
  const unreadNotificationsCount = useMemo(
    () => getNotificationsQuery.data?.data.data.unread_count,
    [getNotificationsQuery.data?.data.data.unread_count]
  );

  // Mutation đọc thông báo
  const readNotificationMutation = useMutation({
    mutationFn: notificationApi.readNotifications,
    onSuccess: () => {
      getNotificationsQuery.refetch();
    }
  });

  // Xử lý đọc thông báo
  const handleReadNotifications = (notificationId?: string) => {
    readNotificationMutation.mutate(notificationId);
  };

  // Mutation xóa thông báo
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationApi.deleteNotifications,
    onSuccess: () => {
      getNotificationsQuery.refetch();
    }
  });

  // Xử lý xóa thông báo
  const handleDeleteNotifications = (notificationId?: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return (
    <Tippy
      interactive
      trigger='click'
      placement='bottom-end'
      offset={[0, 10]}
      render={() => (
        <div className='bg-white rounded-lg shadow-2xl w-[350px]'>
          <div className='flex justify-between items-center px-6 py-3'>
            <h3 className='text-lg font-semibold'>Thông báo</h3>
            {unreadNotificationsCount !== undefined && unreadNotificationsCount > 0 && (
              <button onClick={() => handleReadNotifications()} className='ml-16 text-sm text-blue-600'>
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          {/* Danh sách thông báo */}
          {notifications && notifications.length > 0 && !getNotificationsQuery.isLoading && (
            <div className='max-h-[500px] overflow-y-auto px-1'>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={classNames('group pl-6 pr-4 py-3 flex cursor-pointer', {
                    'bg-blue-50': !notification.is_read
                  })}
                >
                  <img
                    src={getImageUrl(notification.sender.avatar)}
                    alt={notification.sender.fullName}
                    className='w-9 h-9 rounded object-cover'
                  />
                  <Link to={notification.path} className='flex-1 ml-5'>
                    <div
                      className='text-slate-600 text-sm line-clamp-3'
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(notification.content)
                      }}
                    />
                    <p className='text-xs text-red-500 mt-1'>
                      {convertMomentFromNowToVietnamese(moment(notification.created_at).fromNow())}
                    </p>
                  </Link>
                  <div>
                    <Tippy
                      interactive
                      trigger='click'
                      placement='bottom-end'
                      offset={[0, 0]}
                      render={() => (
                        <div className='bg-white rounded shadow-2xl'>
                          <div
                            aria-hidden='true'
                            role='button'
                            tabIndex={0}
                            onClick={() => handleReadNotifications(notification._id)}
                            className='pl-3 pr-8 py-2 text-sm text-slate-900 hover:bg-slate-50 border-b'
                          >
                            Đánh dấu đã đọc
                          </div>
                          <div
                            aria-hidden='true'
                            role='button'
                            tabIndex={0}
                            onClick={() => handleDeleteNotifications(notification._id)}
                            className='pl-3 pr-8 py-2 text-sm text-slate-900 hover:bg-slate-50'
                          >
                            Xóa thông báo
                          </div>
                        </div>
                      )}
                    >
                      <button className='opacity-0 pointer-events-none group-hover:opacity-[1] group-hover:pointer-events-auto'>
                        <EllipsisHorizontalIcon className='w-5 h-5' />
                      </button>
                    </Tippy>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Danh sách thông báo trống */}
          {notifications && notifications.length <= 0 && !getNotificationsQuery.isLoading && (
            <div className='flex flex-col justify-center items-center py-10'>
              <EmptyImage className='w-[66px] h-[85px]' />
              <p className='text-sm text-center text-slate-900 mt-4'>Chưa có thông báo nào</p>
            </div>
          )}
          {/* Xóa tất cả */}
          {notifications && notifications.length > 0 && !getNotificationsQuery.isLoading && (
            <div className='flex justify-center py-2'>
              <button onClick={() => handleDeleteNotifications()} className='text-sm text-red-500 font-medium'>
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}
    >
      <button className='bg-slate-50 w-9 h-9 rounded flex justify-center items-center mr-4 relative'>
        <BellIcon className='w-6 h-6 fill-none' />
        {unreadNotificationsCount !== undefined && unreadNotificationsCount > 0 && (
          <span className='absolute -top-1 -right-1  bg-red-500 text-[10px] text-white font-bold rounded-full w-5 h-5 flex justify-center items-center'>
            {unreadNotificationsCount <= 9 ? unreadNotificationsCount : '9+'}
          </span>
        )}
      </button>
    </Tippy>
  );
};

export default Notification;
