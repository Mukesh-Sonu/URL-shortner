import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UrlState } from '@/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkIcon, LogOut } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { logout } from '@/db/apiAuth';
import { BarLoader } from 'react-spinners';

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState() || {};

  const { loading, fn: fnLogout } = useFetch(logout);

  if (loading) {
    if (loading) return <BarLoader width="100%" color="#36d7b7" />;
  }

  return (
    <nav className="flex py-4 justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-16" alt="trimmer-logo" />
      </Link>
      {!user ? (
        <Button onClick={() => navigate('/auth')}>Login</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage
                src={user?.user_metadata?.profile_pic}
                className="object-contain"
              />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/dashboard" className="flex">
                <LinkIcon className="mr-2 h-4 w-4" />
                My Links
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span
                onClick={() => {
                  fnLogout().then(() => {
                    navigate('/');
                    fetchUser();
                  });
                }}
              >
                Log out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default Header;
