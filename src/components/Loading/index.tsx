import React from 'react';
import ReactLoading from 'react-loading';
function Loading() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.2)] flex justify-center items-center">
      <ReactLoading type="bubbles" color="#eee" height={'20%'} width={50} />
    </div>
  );
}

export default Loading;
