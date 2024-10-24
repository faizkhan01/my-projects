import { User } from 'cypress/support/types';
import { faker } from '@faker-js/faker';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { realPhoneNumber } from 'cypress/support/utils';

describe('Customer Edit Profile', () => {
  let customer: User;
  const route = '/dashboard/edit-profile';

  beforeEach(() => {
    cy.task('db:seed');

    cy.getCustomers().then((users) => {
      customer = users[0];
      cy.login(customer.email, Cypress.env('E2E_USER_PASSWORD'));
    });

    cy.visit(route);
    cy.location('pathname').should('equal', route);

    cy.log('save input alias');
    cy.findByRole('button', {
      name: 'Save Changes',
    }).as('saveChangesBtn');
    cy.findByLabelText('First Name').as('firstName');
    cy.findByLabelText('Last Name').as('lastName');
    cy.findByLabelText('Phone Number').as('phoneNumber');
    cy.findByLabelText('Email Address').as('email');
    cy.findByLabelText('Current Password').as('currentPass');
    cy.findByLabelText('New Password').as('newPass');
    cy.findByLabelText('Confirm New Password').as('confirmPass');
    cy.get('#avatar').as('avatar');

    cy.intercept('POST', '*/customers/settings').as('updateProfile');
  });

  describe('Contact info', () => {
    it('should be able to change first and last name, and phone', () => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const formattedPhoneNumber = formatPhoneNumberIntl(realPhoneNumber);
      cy.get('@firstName').clear();
      cy.get('@firstName').type(firstName);
      cy.get('@lastName').clear();
      cy.get('@lastName').type(lastName);
      cy.get('@phoneNumber').clear();
      cy.get('@phoneNumber').type(realPhoneNumber);

      cy.get('@saveChangesBtn').click();

      cy.wait('@updateProfile')
        .interceptFormData((formdata) => {
          cy.log("Make sure it's sending just the data that is changed");
          expect(formdata).to.deep.equal({
            firstName,
            lastName,
            phone: realPhoneNumber,
          });
        })
        .then(({ response }) => {
          expect(response?.statusCode).to.eq(201);
        });

      cy.get('@firstName').should('have.attr', 'value', firstName);
      cy.get('@lastName').should('have.attr', 'value', lastName);
      cy.get('@phoneNumber').should('have.attr', 'value', formattedPhoneNumber);
      cy.contains(/Success/).should('exist');

      cy.reload();
      cy.get('@firstName').should('have.attr', 'value', firstName);
      cy.get('@lastName').should('have.attr', 'value', lastName);
      cy.get('@phoneNumber').should('have.attr', 'value', formattedPhoneNumber);
    });

    it('should be able to change the password for a new one', () => {
      const oldPassword = Cypress.env('E2E_USER_PASSWORD');
      const newPassword = 'newPassword1234';

      cy.get('@currentPass').type(oldPassword);
      cy.get('@newPass').type(newPassword);
      cy.get('@confirmPass').type(newPassword);

      cy.get('@saveChangesBtn').click();

      cy.wait('@updateProfile')
        .interceptFormData((formdata) => {
          cy.log("Make sure it's sending just the data that is changed");
          expect(formdata).to.deep.equal({
            oldPassword,
            newPassword,
            newPasswordConfirmation: newPassword,
          });
        })
        .then(({ response }) => {
          expect(response?.statusCode).to.eq(201);
        });

      cy.logout();
      cy.login(customer.email, newPassword);
      cy.visit(route);
      cy.getCookie('token').should('exist');
      cy.location().its('pathname').should('equal', route);
    });

    it('should be able to change the email for a new one', () => {
      const newEmail = faker.internet.email();

      cy.get('@email').clear();
      cy.get('@email').type(newEmail);

      cy.get('@saveChangesBtn').click();

      cy.wait('@updateProfile')
        .interceptFormData((formdata) => {
          cy.log("Make sure it's sending just the data that is changed");
          expect(formdata).to.deep.equal({
            email: newEmail,
          });
        })
        .then(({ response }) => {
          expect(response?.statusCode).to.eq(201);
        });

      cy.task('getLastEmail').then((data) => {
        cy.document().invoke('write', data.html);

        cy.findByRole('link', {
          name: /confirm/i,
        }).then((el) => {
          const href = el.prop('href');
          cy.visit(href);
        });
        cy.location('pathname').should('equal', '/');
      });

      cy.log('Should be able to login with the new email after confirmation');
      cy.login(newEmail, Cypress.env('E2E_USER_PASSWORD'));
      cy.getCookie('token').should('exist');
      cy.visit(route);
      cy.location('pathname').should('equal', route);
      cy.get('@email').should('have.attr', 'value', newEmail);
    });

    it('should be able to change the avatar for a new one', () => {
      cy.fixture('images/customer-avatar.png').as('avatarImg');
      cy.get('@avatar').selectFile('@avatarImg', {
        force: true,
      });

      cy.get('@saveChangesBtn').click();

      cy.wait('@updateProfile')
        .interceptFormData((formdata) => {
          cy.log("Make sure it's sending just the data that is changed");
          expect(Object.keys(formdata)).to.have.length(1);
          expect(formdata['avatar']).to.be.not.undefined;
        })
        .then(({ response }) => {
          expect(response?.statusCode).to.eq(201);
        });
    });
  });
});
