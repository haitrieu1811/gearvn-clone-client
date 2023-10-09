import { ForwardedRef, ImgHTMLAttributes, forwardRef } from 'react';

import fallback from 'src/assets/images/fallback-avatar.jpg';
import { getImageUrl } from 'src/utils/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackImage?: string;
}

const Image = ({ src, fallbackImage = fallback, ...rest }: ImageProps, ref: ForwardedRef<HTMLImageElement>) => {
  return <img src={!!src ? getImageUrl(src) : fallbackImage} {...rest} ref={ref} loading='lazy' />;
};

export default forwardRef<HTMLImageElement, ImageProps>(Image);
