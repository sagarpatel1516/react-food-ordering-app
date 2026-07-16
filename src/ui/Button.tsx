import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  to?: string;
  type: 'small' | 'primary' | 'round' | 'secondary';
  onClick?: () => void;
};

function Button({ children, disabled, to, type, onClick }: ButtonProps) {
  const base =
    'inline-block text-sm rounded-full bg-yellow-400 px-4 py-3 font-semibold uppercase tracking-wide';

  const styles = {
    small: base,
    primary: base,
    round: base,
    secondary: base,
  };

  if (to)
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={styles[type]}
    >
      {children}
    </button>
  );
}

export default Button;
