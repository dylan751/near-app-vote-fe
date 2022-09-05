import { Fragment, useState } from 'react';

interface props {
  children: JSX.Element | JSX.Element[];
  title: any;
  wrapperStyle?: string;
  childrenStyle?: string;
  titleStyle?: string;
}

const TitleWrapper: React.FC<props> = ({ children, title, wrapperStyle, childrenStyle, titleStyle }) => {
  const [showTitle, setShowTitle] = useState<boolean>(false);

  return (
    <div className={`relative ${wrapperStyle}`}>
      <div
        className={childrenStyle}
        onMouseOver={(e) => {
          setShowTitle(true);
        }}
        onMouseLeave={(e) => {
          setShowTitle(false);
        }}
      >
        {children}
        {/* Title hover */}
        {showTitle && (
          <div
            className={`absolute z-50  px-2 py-1 text-xs font-semibold bg-white text-gray-600 rounded-md top-12 ${titleStyle}`}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleWrapper;
