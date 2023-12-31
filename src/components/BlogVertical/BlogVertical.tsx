import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import PATH from 'src/constants/path';
import { BlogType } from 'src/types/blog.type';
import { generateNameId } from 'src/utils/utils';
import Image from '../Image';

interface BlogVerticalProps {
  data: BlogType;
}

const BlogVertical = ({ data }: BlogVerticalProps) => {
  return (
    <div className='col-span-3'>
      <Link to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}>
        <Image src={data.thumbnail} alt={data.name_vi} className='w-full h-[100px] md:h-[160px] object-cover rounded' />
      </Link>
      <Link
        to={`${PATH.BLOG_DETAIL_WITHOUT_ID}/${generateNameId({ name: data.name_vi, id: data._id })}`}
        className='text-[#333333] block mt-2'
      >
        <span className='line-clamp-2 font-semibold text-sm md:text-base'>{data.name_vi}</span>
      </Link>
    </div>
  );
};

BlogVertical.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    name_vi: PropTypes.string.isRequired,
    name_en: PropTypes.string.isRequired,
    content_vi: PropTypes.string.isRequired,
    content_en: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired
  }).isRequired
};

export default BlogVertical;
