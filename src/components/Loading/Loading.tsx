const Loading = () => {
  return (
    <div className='inline-block relative w-20 h-20'>
      <div
        className='inline-block absolute left-2 w-4 bg-primary animate-lds-facebook'
        style={{ animationDelay: '-0.24s' }}
      />
      <div
        className='inline-block absolute left-8 w-4 bg-primary animate-lds-facebook'
        style={{ animationDelay: '-0.12s' }}
      />
      <div className='inline-block absolute left-14 w-4 bg-primary animate-lds-facebook' />
    </div>
  );
};

export default Loading;
