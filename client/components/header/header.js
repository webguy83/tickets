import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: 'Sign Up',
      href: '/auth/signup',
    },
    !currentUser && {
      label: 'Sign In',
      href: '/auth/signin',
    },
    currentUser && {
      label: 'Sign Out',
      href: '/auth/signout',
    },
  ];

  const getMenu = (links) => {
    return links
      .filter((linkObj) => linkObj)
      .map((link) => {
        return (
          <li key={link.href}>
            <Link href={link.href}>
              <a className="nav-link">{link.label}</a>
            </Link>
          </li>
        );
      });
  };
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">NoobTixx</a>
      </Link>

      <div className="d-flex justify-contnet-end">
        <ul className="nav d-flex align-items-center">{getMenu(links)}</ul>
      </div>
    </nav>
  );
};

export default Header;
