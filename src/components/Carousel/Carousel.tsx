import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Carousel = () => {
  return (
    <Swiper
      autoplay={{
        delay: 3000
      }}
      loop={true}
      pagination={{
        clickable: true
      }}
      navigation={true}
      modules={[Pagination, Navigation, Autoplay]}
      className='mySwiper select-none'
    >
      <SwiperSlide>
        <img
          src='https://file.hstatic.net/200000722513/file/pc-gaming-slider_aae89bcd58c84899b447b67357feb719.png'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://theme.hstatic.net/1000026716/1000440777/14/slideshow_5.jpg?v=36861'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://file.hstatic.net/200000722513/file/laptop-sinh-vien-t7-slider_50dfd01966f646fbb661311573f5fdee.png'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://file.hstatic.net/200000722513/file/1_web_slider_800x400__1__0edbd2524b1142b3906d76d1922d52c9.png'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://theme.hstatic.net/1000026716/1000440777/14/slideshow_8.jpg?v=36861'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://file.hstatic.net/200000722513/file/20230712-resize-800x400_5a82536163be47df8e57241198f47e3d.jpg'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          src='https://file.hstatic.net/200000722513/file/banner_slider_10_b7a9446ffa0241a0bd527b8732c53a5b.png'
          alt=''
          className='rounded'
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Carousel;
