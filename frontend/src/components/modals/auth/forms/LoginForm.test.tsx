import { render, fireEvent, screen, act, waitFor } from '@/test-utils';
import LoginForm from './LoginForm';

const mockOnSubmit = jest.fn();
const mockOnForgotPassword = jest.fn();

describe('LogInCustomerForm', () => {
  describe('rendering', () => {
    it('should render correctly', () => {
      const tree = render(
        <LoginForm
          onSubmit={mockOnSubmit}
          loading={false}
          onForgotPasswordClick={mockOnForgotPassword}
        />,
      );
      expect(tree).toMatchSnapshot();
    });

    it('should disable submitButton if the form is loading', async () => {
      await act(async () => {
        render(
          <LoginForm
            onSubmit={mockOnSubmit}
            loading
            onForgotPasswordClick={mockOnForgotPassword}
          />,
        );
      });

      const submitButton = screen.getByRole('button', { name: /log in/i });

      expect(submitButton).toBeDisabled();
    });

    it("should show 'forgot password' button", async () => {
      await act(async () => {
        render(
          <LoginForm
            onSubmit={mockOnSubmit}
            loading
            onForgotPasswordClick={mockOnForgotPassword}
          />,
        );
      });

      const forgotPasswordLink = screen.getByRole('button', {
        name: /forgot password/i,
      });

      expect(forgotPasswordLink).toBeInTheDocument();
    });

    it('should show email and password fields', async () => {
      await act(async () => {
        render(
          <LoginForm
            onSubmit={mockOnSubmit}
            loading
            onForgotPasswordClick={mockOnForgotPassword}
          />,
        );
      });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onForgotPasswordClick when clicked the Forgot Password button', async () => {
      await act(async () => {
        render(
          <LoginForm
            onSubmit={mockOnSubmit}
            loading={false}
            onForgotPasswordClick={mockOnForgotPassword}
          />,
        );
      });

      const forgotPasswordButton = screen.getByRole('button', {
        name: /forgot password/i,
      });

      fireEvent.click(forgotPasswordButton);

      expect(mockOnForgotPassword).toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    beforeEach(async () => {
      await act(async () => {
        render(
          <LoginForm
            onSubmit={mockOnSubmit}
            loading={false}
            onForgotPasswordClick={mockOnForgotPassword}
          />,
        );
      });
    });

    describe('when the form is submitted without data', () => {
      it('should display an error message for the email field and not submit the form', async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.submit(submitButton);

        const emailError = await screen.findByText('Email is required');

        expect(emailError).toBeInTheDocument();
        expect(screen.queryByText('Invalid Email')).not.toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it('should display an error message for the password field and not submit the form', async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.submit(submitButton);

        const passwordError = await screen.findByText('Password is required');

        expect(passwordError).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    describe('when the form is submitted with invalid data', () => {
      it('should display an error message for the email field and not submit the form', async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const emailInput = screen.getByLabelText('Email');

        fireEvent.change(emailInput, { target: { value: 'email' } });
        fireEvent.submit(submitButton);

        expect(await screen.findByText('Invalid Email')).toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it('should display an error message for the password field and not submit the form if the password is too short', async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(passwordInput, { target: { value: 'pass' } });
        fireEvent.submit(submitButton);

        expect(await screen.findByText(/8 characters/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it("should display an error message for the password field and not submit the form if the password doesn't contain upper case letter", async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.submit(submitButton);

        expect(await screen.findByText(/upper case/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it("should display an error message for the password field and not submit the form if the password doesn't contain lower case letter", async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(passwordInput, { target: { value: 'PASSWORD' } });
        fireEvent.submit(submitButton);

        expect(await screen.findByText(/lower case/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });

      it("should display an error message for the password field and not submit the form if the password doesn't contain any numbers", async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(passwordInput, { target: { value: 'Password' } });
        fireEvent.submit(submitButton);

        expect(await screen.findByText(/one number/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    describe('when the form is submitted with valid data', () => {
      it('should submit the form', async () => {
        const submitButton = screen.getByRole('button', { name: /log in/i });
        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByLabelText('Password');

        fireEvent.change(emailInput, { target: { value: 'email@gmail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password1234' } });
        fireEvent.submit(submitButton);

        await waitFor(() => {
          expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
