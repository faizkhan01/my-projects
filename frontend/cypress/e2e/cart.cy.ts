import { User, Product } from 'cypress/support/types';

describe('Cart', () => {
  let customer: User;
  let products: Product[];
  const route = '/cart';

  before(() => {
    cy.log('Seed database');
    cy.task('db:seed');
    cy.log('Save customer');
    cy.getCustomers().then((users) => {
      cy.log(JSON.stringify(users, null, 2));
      customer = users[0];
      expect(customer).to.exist;
    });

    cy.getProducts().then((p) => {
      products = p;
      expect(products).to.exist;
      expect(products.length).to.be.greaterThan(0);
    });
  });

  describe('Without Products', () => {
    beforeEach(() => {
      cy.visit(route);
    });

    it('should avoid to proceed to checkout', () => {
      cy.findByRole('button', { name: /checkout/i }).as('checkoutButton');
      cy.get('@checkoutButton').should('be.disabled');
    });
  });

  describe('With Products', () => {
    const addProduct = () => {
      const product = products[0];
      cy.visit(`/product/${product.slug}/${product.id}`);
      cy.findByRole('button', { name: /add to cart|in cart/i }).click();
    };

    describe('Being a customer', () => {
      beforeEach(() => {
        cy.login(customer.email, Cypress.env('E2E_USER_PASSWORD'));
        addProduct();
      });

      beforeEach(() => {
        cy.visit(route);
      });

      it('should allow to proceed to checkout when some product is selected', () => {
        cy.findByRole('button', { name: /checkout/i }).as('checkoutButton');
        cy.get('@checkoutButton').should('not.be.disabled');
        cy.get('@checkoutButton').click();
        cy.location('pathname').should('eq', '/checkout');
      });

      it('shouldn"t allow to proceed to checkout when none products are selected', () => {
        cy.findByRole('button', { name: /deselect/i }).as('deselectButton');
        cy.get('@deselectButton').click();
        cy.findByRole('button', { name: /checkout/i }).as('checkoutButton');
        cy.get('@checkoutButton').should('be.disabled');
      });
    });
  });
});
