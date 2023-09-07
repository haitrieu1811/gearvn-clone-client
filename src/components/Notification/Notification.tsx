import { useMutation, useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';

import notificationApi from 'src/apis/notification.api';
import { GetNotificationsRequestParams, Notification } from 'src/types/notification.type';
import socket from 'src/utils/socket';
import { convertMomentFromNowToVietnamese, getImageUrl } from 'src/utils/utils';
import { BellIcon, EllipsisHorizontalIcon, EmptyImage, LoadingIcon } from '../Icons';

type QueryConfig = {
  [key in keyof GetNotificationsRequestParams]: number;
};

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 0
  });

  const queryConfig: QueryConfig = {
    page: pagination.page,
    limit: 10
  };

  // Socket lắng nghe sự kiện có thông báo mới
  useEffect(() => {
    socket.on('receive_notification', (new_notification) => {
      setNotifications((prevState) => [new_notification, ...prevState]);
      setUnreadCount((prevState) => prevState + 1);
    });
  }, []);

  // Query lấy danh sách thông báo
  const getNotificationsQuery = useQuery({
    queryKey: ['notifications', queryConfig],
    queryFn: () => notificationApi.getNotifications(queryConfig),
    keepPreviousData: true
  });

  // Cập nhật lại danh sách thông báo khi có thay đổi về dữ liệu
  useEffect(() => {
    if (getNotificationsQuery.data?.data.data) {
      setPagination({
        page: getNotificationsQuery.data?.data.data.pagination.page,
        page_size: getNotificationsQuery.data?.data.data.pagination.page_size
      });
      setNotifications((prevState) => [...prevState, ...getNotificationsQuery.data?.data.data.notifications]);
      setUnreadCount(getNotificationsQuery.data?.data.data.unread_count);
    }
  }, [getNotificationsQuery.data?.data.data]);

  // Mutation đọc thông báo
  const readNotificationMutation = useMutation(notificationApi.readNotifications);

  // Mutation xóa thông báo
  const deleteNotificationMutation = useMutation(notificationApi.deleteNotifications);

  // Xử lý đọc thông báo
  const handleReadNotifications = (notificationId?: string) => {
    readNotificationMutation.mutate(notificationId, {
      onSuccess: () => {
        if (notificationId) {
          setNotifications((prevState) =>
            prevState.map((notification) => {
              if (notification._id === notificationId) {
                return {
                  ...notification,
                  is_read: true
                };
              }
              return notification;
            })
          );
          setUnreadCount((prevState) => prevState - 1);
        } else {
          setNotifications((prevState) =>
            prevState.map((notification) => ({
              ...notification,
              is_read: true
            }))
          );
          setUnreadCount(0);
        }
      }
    });
  };

  // Xử lý xóa thông báo
  const handleDeleteNotifications = (notificationId?: string) => {
    deleteNotificationMutation.mutate(notificationId, {
      onSuccess: () => {
        if (notificationId) {
          setNotifications((prevState) => prevState.filter((notification) => notification._id !== notificationId));
        } else {
          setNotifications([]);
        }
      }
    });
  };

  // Tải thêm thông báo
  const fetchMoreNotifications = async () => {
    if (pagination.page >= pagination.page_size) return;
    setPagination((prevState) => ({
      ...prevState,
      page: prevState.page + 1
    }));
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
            {unreadCount !== undefined && unreadCount > 0 && (
              <button onClick={() => handleReadNotifications()} className='ml-16 text-sm text-blue-600'>
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Danh sách thông báo */}
          {notifications && notifications.length > 0 && !getNotificationsQuery.isLoading && (
            <div className='pl-1' id='notifications'>
              <InfiniteScroll
                dataLength={notifications.length}
                next={fetchMoreNotifications}
                hasMore={pagination.page < pagination.page_size}
                scrollableTarget='notifications'
                height={500}
                scrollThreshold={1}
                loader={
                  <div className='flex justify-center'>
                    <LoadingIcon className='w-6 h-6' />
                  </div>
                }
              >
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
              </InfiniteScroll>
            </div>
          )}

          {/* Không có thông báo nào */}
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
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className='absolute -top-1 -right-1  bg-red-500 text-[10px] text-white font-bold rounded-full w-5 h-5 flex justify-center items-center'>
            {unreadCount <= 9 ? unreadCount : '9+'}
          </span>
        )}
      </button>
    </Tippy>
  );
};

export default Notification;
