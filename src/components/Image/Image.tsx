import PropTypes from 'prop-types';
import { ImgHTMLAttributes } from 'react';

import defaultImage from 'src/assets/images/fallback-avatar.jpg';
import { getImageUrl } from 'src/utils/utils';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackImage?: string;
}

const Image = ({ src, fallbackImage = defaultImage, ...rest }: ImageProps) => {
  return <img src={Boolean(src) ? getImageUrl(src) : fallbackImage} {...rest} />;
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  defaultImage: PropTypes.string
};

export default Image;
