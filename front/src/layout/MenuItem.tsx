import { Icon } from '@coco-ui/core';
import { IconName } from '@coco-ui/core/dist/components/Icon';
import { Link, useRouteMatch } from 'react-router-dom';

type MenuItemProps = {
  text: string;
  icon: IconName;
  path: string;
  exact?: boolean;
};
const MenuItem = ({
  text, icon, path, exact,
}: MenuItemProps): JSX.Element => {
  const match = useRouteMatch({
    path,
    exact,
  });

  return (
    <Link
      to={path}
      className={`flex items-center py-3 px-8 border-r-4 cursor-pointer select-none ${
        match
          ? 'border-primary-600 font-bold bg-primary-200 text-primary-600'
          : 'bg-white border-white hover:border-primary-50 hover:bg-primary-50 text-gray-600'
      }`}
    >
      <Icon name={icon} />
      <span className="mx-4">{text}</span>
    </Link>
  );
}

export default MenuItem;
