/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/cypress/add-commands';
import 'cypress-intercept-formdata';
import { Product, User } from './types';
import { ParsedMail } from 'mailparser';
import 'cypress-plugin-stripe-elements';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Task to seed the database
       */
      task(event: 'db:seed'): Chainable<any>;
      task(event: 'getLastEmail'): Chainable<ParsedMail>;

      /**
       * Allow to login with the API with JWT
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Allow to logout removing the token from cookies
       */
      logout(): Chainable<void>;

      /**
       * Returns all users from the database
       */
      getUsers(): Chainable<User[]>;

      /**
       * Returns all customers from the database
       */
      getCustomers(): Chainable<User[]>;

      /**
       * Returns products
       */
      getProducts(): Chainable<Product[]>;

      /**
       * Returns all sellers from the database
       */
      getSellers(): Chainable<User[]>;

      /**
       * Allow to get the options from a dropdown like the MUI Autocomplete
       */
      getDropdownOptions(): Chainable<any>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.log('Logging in');

      const loginUrl = `${Cypress.env('apiUrl')}/auth/login`;

      cy.request('POST', loginUrl, {
        email,
        password,
      }).then(
        (response: Cypress.Response<{ message: { accessToken: string } }>) => {
          cy.setCookie('token', response.body.message.accessToken);
        },
      );
    },
    {
      validate: () => {
        cy.getCookie('token')
          .should('exist')
          .then((c) => {
            cy.request({
              url: `${Cypress.env('apiUrl')}/auth/profile`,
              headers: {
                Authorization: `Bearer ${c?.value}`,
              },
            })
              .its('status')
              .should('eq', 200);
          });
      },
    },
  );
});

Cypress.Commands.add('logout', () => {
  cy.log('Logging out');

  cy.clearCookie('token');
});

Cypress.Commands.add('getUsers', () => {
  cy.log('Getting users');
  const apiUrl = Cypress.env('apiUrl');

  return cy.request('GET', `${apiUrl}/test/users`).its('body');
});

Cypress.Commands.add('getCustomers', () => {
  cy.log('Getting customers');
  return cy.getUsers().then((response) => {
    return response.filter((user) => user.role === 'USER');
  });
});

Cypress.Commands.add('getSellers', () => {
  cy.log('Getting sellers');
  return cy.getUsers().then((response) => {
    return response.filter((user) => user.role === 'SELLER');
  });
});

Cypress.Commands.add('getProducts', () => {
  cy.log('Getting products');

  const apiUrl = Cypress.env('apiUrl');
  return cy.request('GET', `${apiUrl}/test/products`).its('body');
});

Cypress.Commands.add('getDropdownOptions', () => {
  return cy.get('.MuiAutocomplete-popper [role="listbox"] [role="option"]', {
    timeout: 10000,
  });
});
