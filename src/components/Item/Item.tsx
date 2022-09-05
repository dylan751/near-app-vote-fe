interface itemProps {
  title: string;
  icon?: any;
  active: boolean;
  fontSize: any;
  css?: string;
  line?: boolean;
}

const Item: React.FC<itemProps> = ({ title, icon, active, fontSize, css, line }) => {
  return (
    <div
      className={`flex realtive items-center justify-start text-white text-xl font-medium my-3 cursor-pointer leading-6 hover:text-opacity-100
    ${active ? 'text-opacity-100' : 'text-opacity-50'} ${
        line ? "after:content-[''] after:w-full after:h-[2px] after:bg-orangeM after:absolute after:-bottom-[2px]" : ''
      } ${css}
    `}
    >
      <div className="mr-2">{icon}</div>
      <h3
        className={`
        truncate
        ${fontSize ? '' : 'text-sm font-light'}
        ${fontSize === 'md' ? 'text-base font-bold' : ''}
      `}
      >
        {title}
      </h3>
    </div>
  );
};

export default Item;
