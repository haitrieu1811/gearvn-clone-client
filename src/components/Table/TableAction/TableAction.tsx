import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

interface TableActionProps {
  editPath?: string;
  editText?: string;
  deleteText?: string;
  deleteMethod?: () => void;
}

const TableAction = ({ editPath, editText = 'Sửa', deleteText = 'Xóa', deleteMethod }: TableActionProps) => {
  return (
    <div className='col-span-1 flex items-center'>
      {editPath && (
        <Link to={editPath} className='font-medium text-sm text-blue-400'>
          {editText}
        </Link>
      )}
      {editPath && deleteMethod && <div className='w-[1px] h-4 bg-slate-200 mx-2'></div>}
      {deleteMethod && (
        <button className='font-medium text-sm text-red-500' onClick={deleteMethod}>
          {deleteText}
        </button>
      )}
    </div>
  );
};

TableAction.propTypes = {
  editPath: PropTypes.string,
  editText: PropTypes.string,
  deleteText: PropTypes.string,
  deleteMethod: PropTypes.func
};

export default TableAction;
