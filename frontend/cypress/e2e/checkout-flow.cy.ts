import { faker } from '@faker-js/faker';
import { User } from 'cypress/support/types';
import { realPhoneNumber } from 'cypress/support/utils';

describe('Checkout Flow', () => {
  /* let customer: User; */

  beforeEach(() => {
    cy.log('Seed database');
    cy.task('db:seed');
    cy.log('Save customer');

    cy.visit('/');
    cy.url().should('include', '/');

    /* cy.getCustomers().then((customers) => { */
    /*   customer = customers[0]; */
    /*   cy.login(customer.email, Cypress.env('E2E_USER_PASSWORD')); */
    /* }); */
  });

  /* describe('Being a customer', () => {}); */

  describe('Being a guest', () => {
    it('should be able to add products to cart, go to checkout page and confirm the order', () => {
      cy.getProducts().then((products) => {
        const product = products[0];

        cy.log('Add product to cart');
        cy.visit(`/product/${product.slug}/${product.id}`);
        cy.findByRole('button', { name: /add to cart/i }).click();
        cy.location('pathname').should('eq', '/cart');

        cy.log('Check that the product is in the cart');
        cy.contains(product.name).should('exist');

        cy.log('Go to checkout page');
        cy.findAllByRole('button', { name: /select all item/i })
          .first()
          .then(($button) => {
            if ($button.attr('disabled') === 'false') {
              $button.trigger('click');
            }
          });
        cy.findByRole('button', { name: /checkout/i }).click();
        cy.findByRole('link', { name: /login as a guest/i }).click();
        cy.location('pathname').should('eq', '/checkout');

        cy.log('Fill in shipping address form');
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        cy.findByLabelText(/first name/i).type(firstName);
        cy.findByLabelText(/last name/i).type(lastName);
        cy.findByLabelText(/phone number/i).type(realPhoneNumber);
        cy.findByLabelText(/e-mail/i).type(faker.internet.email());
        cy.findByLabelText('Address').type(faker.address.streetAddress());
        cy.findByLabelText(/zip/i).type(faker.address.zipCode());
        cy.findByLabelText(/city/i).type(faker.address.city());

        cy.findByLabelText(/country/i).click();
        cy.findByRole('option', { name: /canada/i }).click();
        cy.findByLabelText(/state/i).click();
        cy.getDropdownOptions().first().click();

        cy.log('Fill in payment method form');
        const expiryDate = faker.date.future();
        const expiryMonth = expiryDate.getMonth() + 1;
        const expiryYear = expiryDate.getFullYear().toString().substring(2);

        cy.fillElementsInput('cardNumber', '4242424242424242');
        cy.fillElementsInput('cardExpiry', `${expiryMonth}/${expiryYear}`);
        cy.fillElementsInput('cardCvc', '4242424242424242');
        cy.findByLabelText(/card holder/i).type(`${firstName} ${lastName}`);

        cy.log('Submit the order');
        cy.intercept('POST', '/checkout/confirm').as('checkout');
        cy.findByRole('button', { name: /payment/i }).as('paymentButton');
        cy.get('@paymentButton').click();
        cy.get('@paymentButton').should('be.disabled');
        cy.wait('@checkout');

        cy.log('Check that the order is confirmed');
        cy.findByRole('heading', { name: /order confirmed/i }).should('exist');

        cy.log('Closing the order confirmation modal');
        cy.get('body').type('{esc}');
        cy.findByRole('heading', { name: /order confirmed/i }).should(
          'not.exist',
        );
        cy.location('pathname').should('eq', '/');

        cy.log('Check that the product is not in the cart');
        cy.visit('/cart');
        cy.contains(product.name).should('not.exist');
      });
    });
  });
});
