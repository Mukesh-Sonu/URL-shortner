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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LinkIcon, LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const user = true;
  return (
    <nav className="flex py-4 justify-between items-center">
      <Link to="/">
        <img src="/logo.png" className="h-16" alt="trimmer-logo" />
      </Link>
      {!user ? (
        <Button onClick={() => navigate('/auth')}>Login</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mukesh</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>My Links</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default Header;
