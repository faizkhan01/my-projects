import { User } from 'cypress/support/types';
import { faker } from '@faker-js/faker';
import { realPhoneNumber } from 'cypress/support/utils';

describe('seller Edit Settings', () => {
  let seller: User;
  const route = '/sellerDashboard/setting';

  beforeEach(() => {
    cy.task('db:seed');

    cy.getSellers().then((users) => {
      seller = users[0];
      cy.login(seller.email, Cypress.env('E2E_USER_PASSWORD'));
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

    cy.intercept('POST', '*/seller/settings').as('updateSettings');
  });

  it('test', () => {
    console.log('seller', seller);
  });
});
