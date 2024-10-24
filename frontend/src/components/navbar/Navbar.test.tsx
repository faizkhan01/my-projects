import useProfile from '@/hooks/queries/useProfile';
import useWishlist from '@/hooks/queries/customer/useWishlist';
import useCart from '@/hooks/queries/customer/useCart';
import { ProfileData } from '@/types/user';

import { render, fireEvent, screen, act, waitFor } from '@/test-utils';
import Navbar from './Navbar';
import { USER_ROLES } from '@/constants/auth';

jest.mock('@/hooks/queries/useProfile');
jest.mock('@/hooks/queries/customer/useWishlist');
jest.mock('@/hooks/queries/customer/useCart');

describe('Navbar', () => {
  const mockedUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
  const mockedUseWishlist = useWishlist as jest.MockedFunction<
    typeof useWishlist
  >;
  const mockedUseCart = useCart as jest.MockedFunction<typeof useCart>;

  beforeAll(() => {
    mockedUseProfile.mockImplementation(() => ({
      profile: null,
      isLoading: false,
      isLoggedIn: false,
      isValidating: false,
    }));
    mockedUseWishlist.mockImplementation(() => ({
      wishlist: {},
      wishlistArray: [],
      isLoading: false,
      isError: false,
      isValidating: false,
      mutate: jest.fn(),
    }));
    mockedUseCart.mockImplementation(() => ({
      cartArray: [],
      cart: {},
      isLoading: false,
      isError: false,
      isValidating: false,
      mutate: jest.fn(),
      isEmpty: true,
    }));
  });

  describe('rendering', () => {
    it('should render correctly', async () => {
      let tree;
      await act(async () => {
        tree = render(<Navbar />);
      });
      expect(tree).toMatchSnapshot();
    });

    it('should show the wishlist and cart links', async () => {
      await act(async () => {
        render(<Navbar />);
      });

      const wishlistButton = screen.getByRole('link', {
        name: /wishlist/i,
      });
      const cartButton = screen.getByRole('link', {
        name: /cart/i,
      });

      expect(wishlistButton).toBeInTheDocument();
      expect(cartButton).toBeInTheDocument();
    });

    it('should show the search bar', async () => {
      await act(async () => {
        render(<Navbar />);
      });

      const searchBar = screen.getByRole('searchbox');
      const searchButton = screen.getByRole('button', {
        name: /search/i,
      });

      expect(searchBar).toBeInTheDocument();
      expect(searchButton).toBeInTheDocument();
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(async () => {
      await act(async () => {
        render(<Navbar />);
      });
    });

    it('should render Join button', async () => {
      const joinButton = screen.getByRole('button', { name: /join/i });
      expect(joinButton).toBeInTheDocument();
    });

    it('should show a popover when the user clicks the Join Button', async () => {
      const joinButton = screen.getByRole('button', { name: /join/i });
      fireEvent.click(joinButton);

      await waitFor(() => {
        expect(screen.getByText(/log in/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
      });
    });
  });

  describe('when user is logged in', () => {
    const profile: ProfileData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      avatar: null,
      role: USER_ROLES.USER,
      id: 1,
      notificationsCount: 0,
    };

    beforeAll(() => {
      mockedUseProfile.mockImplementation(() => ({
        profile,
        isLoading: false,
        isError: false,
        isLoggedIn: true,
        isValidating: false,
      }));
    });

    beforeEach(async () => {
      await act(async () => {
        render(<Navbar />);
      });
    });

    it('should replace the Join text for the user first name', async () => {
      const joinButton = screen.queryByRole('button', { name: /join/i });
      const userFirstName = screen.getByRole('button', {
        name: profile.firstName,
      });

      expect(joinButton).not.toBeInTheDocument();
      expect(userFirstName).toBeInTheDocument();
    });

    it('should show a menu when the user clicks their name', async () => {
      const userFirstName = screen.getByRole('button', {
        name: profile.firstName,
      });
      fireEvent.click(userFirstName);

      await waitFor(() => {
        const menu = screen.getByRole('menu');
        const accountLink = screen.getByText(/account/i);
        const logoutLink = screen.getByText(/sign out/i);

        expect(menu).toBeInTheDocument();
        expect(accountLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
      });
    });
  });
});
