const CLASSES = {
  TABLE_HEAD: 'grid grid-cols-12 font-semibold py-3 px-8 border-b text-sm',
  TABLE_BODY:
    'grid grid-cols-12 py-2 px-8 border-b border-b-slate-100 text-slate-500 text-sm hover:bg-slate-100/50 cursor-pointer',
  TABLE_FOOT: 'sticky bottom-0 bg-white py-4 px-5 flex justify-between items-center border-t'
} as const;

export default CLASSES;
