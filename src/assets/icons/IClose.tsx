import React from 'react';

const IClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {

  return (
    <button {...props}>
      <svg
        width="25"
        height="25"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className='hover:rotate-180 z-50 transition-all -ml-[4.5px]'
      >
        <path
          d="M15.2839 25.9668C14.9673 25.9668 14.6506 25.8501 14.4006 25.6001C13.9173 25.1168 13.9173 24.3168 14.4006 23.8334L23.8339 14.4001C24.3173 13.9168 25.1173 13.9168 25.6006 14.4001C26.0839 14.8834 26.0839 15.6834 25.6006 16.1668L16.1673 25.6001C15.9339 25.8501 15.6006 25.9668 15.2839 25.9668Z"
          fill={props.color}
        />
        <path
          d="M24.7173 25.9668C24.4006 25.9668 24.0839 25.8501 23.8339 25.6001L14.4006 16.1668C13.9173 15.6834 13.9173 14.8834 14.4006 14.4001C14.8839 13.9168 15.6839 13.9168 16.1673 14.4001L25.6006 23.8334C26.0839 24.3168 26.0839 25.1168 25.6006 25.6001C25.3506 25.8501 25.0339 25.9668 24.7173 25.9668Z"
          fill={props.color}
        />
      </svg>
    </button>
  );
};

export default IClose;
