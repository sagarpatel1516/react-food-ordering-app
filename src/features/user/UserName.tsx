import { useAppSelector } from '../../hooks';

function UserName() {
  const userName = useAppSelector((state) => state.user.userName);

  if (!userName) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{userName}</div>
  );
}

export default UserName;
