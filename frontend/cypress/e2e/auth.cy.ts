import { User } from 'cypress/support/types';
import { faker } from '@faker-js/faker';

describe('Authentication', () => {
  let customer: User;
  let seller: User;

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('include', '/');

    cy.log('Seed database');
    cy.task('db:seed');
    cy.log('Save customer');
    cy.getUsers().then((users) => {
      users.forEach((user) => {
        if (user.role === 'USER') {
          customer = user;
        } else if (user.role === 'SELLER') {
          seller = user;
        }
      });
      expect(customer).to.exist;
      expect(seller).to.exist;
    });

    cy.intercept('POST', '/api/auth/login').as('login');
  });

  describe('Sign Up', () => {
    beforeEach(() => {
      cy.log('Open login modal');
      cy.findByRole('button', {
        name: /join/i,
      }).click();

      cy.findByRole('button', {
        name: /sign up/i,
      }).click();

      cy.findByRole('dialog', {
        hidden: false,
      }).as('signUpDialog');
    });

    describe('Seller', () => {
      it('should sign up a new seller', () => {
        const email = faker.internet.email();
        const password = 'Password1234';

        cy.get('@signUpDialog').within(() => {
          cy.findAllByRole('radio').eq(1).check();
          cy.findByRole('button', {
            name: /sign up/i,
          }).as('signUpButton');

          cy.log('Fill form');
          cy.findByLabelText(/first name/i).type(faker.name.firstName());
          cy.findByLabelText(/last name/i).type(faker.name.lastName());
          cy.findByLabelText(/email/i).type(email);
          cy.findByLabelText(/country/i).click();

          cy.log("Check it's showing the country list");
          cy.document()
            .findByRole('option', {
              name: /united states/i,
            })
            .should('exist')
            .as('usCountry');
          cy.document()
            .findByRole('option', {
              name: /canada/i,
            })
            .should('exist');

          cy.get('@usCountry').click();
          cy.findByLabelText(/shop name/i).type(faker.lorem.word());
          cy.findAllByLabelText(/password/i)
            .first()
            .type(password);
          cy.findByLabelText(/confirm/i).type(password);
          cy.findByLabelText(/read and accept/i).check();

          cy.get('@signUpButton').should('not.be.disabled').click();
        });

        cy.log('Check success');
        cy.root().contains('Success').should('exist');

        cy.log('Get email and confirm registration');
        cy.task('getLastEmail').then((data) => {
          cy.document().invoke('write', data.html);

          cy.findByRole('link', {
            name: /confirm/i,
          }).then((el) => {
            const href = el.prop('href');

            cy.visit(href);
          });

          cy.location('pathname').should('equal', '/dashboard');
        });

        cy.log('Check can login after registering');
        cy.visit('/');
        cy.clearCookies();
        cy.login(email, password);
        cy.visit('/dashboard');
        cy.location('pathname').should('equal', '/dashboard');
      });
    });

    describe('Customer', () => {
      it('should sign up a new customer', () => {
        const email = faker.internet.email();
        const password = 'Password1234';
        cy.get('@signUpDialog').within(() => {
          cy.findByRole('button', {
            name: /sign up/i,
          }).as('signUpButton');

          cy.log('Fill form');
          cy.findByLabelText(/first name/i).type(faker.name.firstName());
          cy.findByLabelText(/last name/i).type(faker.name.lastName());
          cy.findByLabelText(/email/i).type(email);
          cy.findAllByLabelText(/password/i)
            .first()
            .type(password);
          cy.findByLabelText(/confirm/i).type(password);
          cy.findByLabelText(/read and accept/i).check();

          cy.get('@signUpButton').should('not.be.disabled').click();
        });

        cy.log('Check success');
        cy.root().contains('Success').should('exist');

        cy.log('Get email and confirm registration');
        cy.task('getLastEmail').then((data) => {
          cy.document().invoke('write', data.html);

          cy.findByRole('link', {
            name: /confirm/i,
          }).then((el) => {
            const href = el.prop('href');
            cy.visit(href);
          });

          cy.location('pathname').should('equal', '/dashboard');
        });

        cy.log('Check can login after registering');
        cy.visit('/');
        cy.clearCookies();
        cy.login(email, password);
        cy.visit('/dashboard');
        cy.location('pathname').should('equal', '/dashboard');
      });
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      cy.log('Open login modal');
      cy.findByRole('button', {
        name: /join/i,
      }).click();

      cy.findByRole('button', {
        name: /log in/i,
      }).click();

      cy.findByRole('dialog', {
        hidden: false,
      }).as('loginDialog');
    });

    it('should be able to log in as a customer', () => {
      const { email } = seller;
      const password = Cypress.env('E2E_USER_PASSWORD');

      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', {
        name: 'Log In',
      }).as('loginButton');

      cy.get('@loginButton').click();

      cy.wait('@login').its('response.statusCode').should('eq', 200);

      cy.url()
        .should('include', '/dashboard')
        .then(() => {
          cy.getCookie('token').should('exist');
        });
    });

    it('should be able to log in as a seller', () => {
      const { email } = customer;
      const password = Cypress.env('E2E_USER_PASSWORD');

      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findByRole('button', {
        name: 'Log In',
      }).as('loginButton');

      cy.get('@loginButton').click();

      cy.wait('@login').its('response.statusCode').should('eq', 200);

      cy.url()
        .should('include', '/dashboard')
        .then(() => {
          cy.getCookie('token').should('exist');
        });
    });

    it('shouldn"t be able to log in if the password is wrong', () => {
      const { email } = customer;

      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type('Random1234');

      cy.findByRole('button', {
        name: 'Log In',
      }).click();

      cy.wait('@login')
        .its('response.statusCode')
        .should('be.gte', 400)
        .and('be.lessThan', 500);

      cy.contains(/Error/i).should('exist');
      cy.url().should('include', '/');
      cy.getCookie('token').should('not.exist');
    });
  });

  describe('Forgot Password', () => {
    beforeEach(() => {
      cy.log('Open login modal');
      cy.findByRole('button', {
        name: /join/i,
      }).click();

      cy.findByRole('button', {
        name: /log in/i,
      }).click();

      cy.findByRole('dialog', {
        hidden: false,
      }).as('loginDialog');
    });

    it('should be able to reset the password', () => {
      const { email } = customer;
      const oldPassword = Cypress.env('E2E_USER_PASSWORD');
      const newPassword = 'NewPassword1234';

      cy.intercept('POST', '**/forget-password').as('forgetPassword');
      cy.intercept('POST', '**/forget-password/confirm').as(
        'confirmForgetPass',
      );

      cy.findByRole('button', {
        name: /forgot password/i,
      }).click();

      cy.findByLabelText(/email/i).type(email);

      cy.findByRole('button', {
        name: /reset password/i,
      }).click();

      cy.log('Check if the email was sent');
      cy.wait('@forgetPassword').its('response.statusCode').should('eq', 200);

      cy.log('Check that the confirmation modal opens');
      cy.findByRole('heading', {
        name: /check your email/i,
      }).should('exist');
      cy.contains(email).should('exist');

      cy.log('Get the last email sent');
      cy.task('getLastEmail').then((data) => {
        cy.document().invoke('write', data.html);

        cy.findByRole('link', {
          name: /click here/i,
        }).then((el) => {
          const href = el.prop('href');
          const searchParams = new URL(href).searchParams;
          const code = searchParams.get('code');

          expect(code).to.not.be.undefined;

          cy.visit(href);

          cy.location().its('pathname').should('eq', '/auth/reset-password');
          cy.location().its('search').should('eq', `?code=${code}`);
        });
      });

      cy.log('fill the reset password form');

      cy.findAllByLabelText(/password/i).each((el) =>
        cy.wrap(el).type(newPassword),
      );

      cy.findByRole('button', {
        name: /save/i,
      }).click();

      cy.wait('@confirmForgetPass')
        .its('response.statusCode')
        .should('eq', 200);

      cy.findByRole('dialog', {
        hidden: false,
        timeout: 10000,
      })
        .should('exist')
        .as('loginDialog');

      cy.get('@loginDialog').within(() => {
        cy.findByLabelText(/email/i).as('emailInput');
        cy.findByLabelText(/password/i).as('passInput');
        cy.findByRole('button', {
          name: 'Log In',
        }).as('loginButton');

        cy.log('login with old password should break');
        cy.get('@emailInput').type(email);
        cy.get('@passInput').type(oldPassword);
        cy.get('@loginButton').click();

        cy.wait('@login').its('response.statusCode').should('eq', 400);
        cy.url().should('include', '/');

        cy.log('login with new password should work');
        cy.get('@emailInput').clear();
        cy.get('@emailInput').type(email);
        cy.get('@passInput').clear();
        cy.get('@passInput').type(newPassword);
        cy.get('@loginButton').click();

        cy.wait('@login').its('response.statusCode').should('eq', 200);
        cy.url({
          timeout: 10000,
        }).should('include', '/dashboard');
      });
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Log in
      cy.login(customer.email, Cypress.env('E2E_USER_PASSWORD'));
      cy.visit('/');
    });

    it('should be able to log out from the navbar', () => {
      cy.findByRole('button', {
        name: customer.firstName,
      }).click();

      cy.findByRole('menuitem', {
        name: /sign out/i,
      }).click();

      cy.location('pathname').should('equal', '/');
      cy.getCookie('token').should('not.exist');
    });

    it('should be able to log out going to /logout', () => {
      cy.visit('/logout');

      cy.location('pathname').should('equal', '/');
      cy.getCookie('token').should('not.exist');
    });
  });
});
