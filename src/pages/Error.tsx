import { Link } from 'react-router-dom';
import Button from '../components/Button/Button';

const Error: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="font-bold text-[60px]">404</h1>
      <h3 className="text-2xl">oops! Page not found</h3>
      <Link to={'/'}>
        <Button group={false} outline={true} title="Home" upcase={true} active={false} css="mt-4" />
      </Link>
    </div>
  );
};

export default Error;
