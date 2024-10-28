import React, {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade } from 'swiper/modules';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';

// const images = [
//     'https://images.unsplash.com/photo-1531973576160-7125cd663d86',
//     'https://images.unsplash.com/photo-1664575602276-acd073f104c1',
//     'https://images.unsplash.com/photo-1529400971008-f566de0e6dfc',
//   ];

const SwiperComponent: React.FC = () => {
    //const [imagesLoaded, setImagesLoaded] = useState(false);
    // useEffect(() => {
    //     const loadImages = async () => {
    //       const imagePromises = images.map(src => {
    //         return new Promise((resolve, reject) => {
    //           const img = new Image();
    //           img.src = src;
    //           img.onload = resolve;
    //           img.onerror = reject;
    //         });
    //       });
    
    //       await Promise.all(imagePromises);
    //       setImagesLoaded(true);
    //     };
    
    //     loadImages();
    //   }, []);
    //   if (!imagesLoaded) {
    //     return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
    //   }
  return (
    // <Swiper
    //   modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
    //   spaceBetween={0}
    //   slidesPerView={1}
    //   effect="fade"
    //   autoplay={{
    //     delay: 3000,
    //     disableOnInteraction: false,
    //   }}
    //   speed={1000} // 전환 속도를 늘림
    //   loop={true}
    //   className="absolute inset-0 w-full h-full"
    // >
    //   {images.map((image, index) => (
    //     <SwiperSlide key={index}>
    //       <img src={image} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
    //     </SwiperSlide>
    //   ))}
    // </Swiper>
    
    <img src='https://images.unsplash.com/photo-1529400971008-f566de0e6dfc' className="w-full h-full object-cover" />
  );
};

export default SwiperComponent;