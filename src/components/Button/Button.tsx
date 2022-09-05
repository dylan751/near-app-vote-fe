interface props {
  title: any;
  icon?: any;
  upcase: boolean;
  active: boolean;
  outline: boolean;
  group?: boolean;
  css?: string;
  handle?: Function;
  idDisable?: boolean;
}

const Button: React.FC<props> = ({ title, icon, upcase, active, outline, group, css, handle, idDisable }) => {
  return (
    <button
      className={`flex items-center font-semibold  text-center text-sm leading-[26px] rounded-lg truncate 
        `}
      onClick={
        handle
          ? () => {
              handle();
            }
          : () => {}
      }
      disabled={idDisable}
    >
      {icon && <img className="w-5 bg-transparent mr-2" src={icon} alt="icon-pizza" />}
      <span
        className={`
          rounded-lg text-white transition ease-in-out duration-150
          ${upcase ? 'uppercase' : ''}
          ${outline ? 'border-[1px] border-white' : ''}  text-white   	
          ${
            group
              ? 'px-2 py-[4px] text-opacity-50 hover:text-opacity-100'
              : 'px-5 py-[6px] text-opacity-50 hover:text-opacity-100'
          } 
          ${active ? 'bg-primary-30 text-opacity-100 text-white' : ''}
          ${idDisable ? 'hover:text-opacity-50 cursor-not-allowed' : ''}
          ${css}
        `}
      >
        {title}
      </span>
    </button>
  );
};

export default Button;
