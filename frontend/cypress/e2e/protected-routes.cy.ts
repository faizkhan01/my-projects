import { User } from 'cypress/support/types';

interface ProtectedRoute {
  allowedRoles: User['role'][];
  route: string;
  only?: boolean;
  redirectTo?: string | ((role: User['role']) => string);
}

const allRoles: User['role'][] = ['USER', 'SELLER'];

const protectedRoutes: ProtectedRoute[] = [
  {
    route: '/dashboard',
    allowedRoles: ['USER', 'SELLER'],
  },
  {
    route: '/dashboard/edit-profile',
    allowedRoles: ['USER'],
  },
  {
    route: '/dashboard/payment-methods',
    allowedRoles: ['USER'],
  },
  {
    route: '/dashboard/shipping-addresses',
    allowedRoles: ['USER'],
  },
  {
    route: '/dashboard/messages',
    allowedRoles: ['USER', 'SELLER'],
  },
  {
    route: '/dashboard/billing-addresses',
    allowedRoles: ['USER'],
  },
  {
    route: '/dashboard/my-orders',
    allowedRoles: ['USER'],
  },
  {
    route: '/dashboard/notifications',
    allowedRoles: ['USER', 'SELLER'],
  },
  {
    route: '/dashboard/refund-return',
    allowedRoles: ['USER', 'SELLER'],
  },
  {
    route: '/dashboard/products',
    allowedRoles: ['SELLER'],
  },
  {
    route: '/dashboard/products/new',
    allowedRoles: ['SELLER'],
  },
  // route /dashboard/orders/[id]/... pending to cypress
  // {
  //   route: '/dashboard/orders/1/fulfill',
  //   allowedRoles: ['SELLER'],
  // },
  // {
  //   route: '/dashboard/orders/1',
  //   allowedRoles: ['SELLER'],
  // },
  {
    route: '/dashboard/orders',
    allowedRoles: ['SELLER'],
    redirectTo: '/dashboard/my-orders',
  },
  {
    route: '/dashboard/shipping',
    allowedRoles: ['SELLER'],
  },
  {
    route: '/dashboard/shipping/methods',
    allowedRoles: ['SELLER'],
  },
  {
    route: '/dashboard/shipping/methods/new',
    allowedRoles: ['SELLER'],
  },
  {
    route: '/dashboard/bank-account',
    allowedRoles: ['SELLER'],
  },
  {
    route: '/dashboard/customers',
    allowedRoles: ['SELLER'],
  },
];

describe('Protected routes', () => {
  let users: User[];

  before(() => {
    cy.task('db:seed');
    cy.getUsers().then((found) => {
      users = found;
      expect(users.length).to.be.at.least(1);
    });
  });

  Cypress._.each(protectedRoutes, (protectedRoute) => {
    let describeTest: Mocha.ExclusiveSuiteFunction | Mocha.SuiteFunction =
      describe;

    if (protectedRoute.only) {
      describeTest = describe.only;
    }

    describeTest(`Route: ${protectedRoute.route}`, () => {
      it('should redirect to home page if user is not logged in', () => {
        cy.visit(protectedRoute.route);
        cy.location('pathname').should('eq', '/');
      });

      const notAllowedRoles = Cypress._.difference(
        allRoles,
        protectedRoute.allowedRoles,
      );
      const { allowedRoles } = protectedRoute;

      Cypress._.each(notAllowedRoles, (notAllowedRole) => {
        it(`should redirect to dashboard page if user is logged in but has a not allowed role: ${notAllowedRole}`, () => {
          const notAllowedUser = Cypress._.find(
            users,
            (user) => user.role === notAllowedRole,
          );

          cy.log(
            `Trying to access with a user with role of ${notAllowedUser?.role}`,
          );

          cy.login(
            notAllowedUser?.email || '',
            Cypress.env('E2E_USER_PASSWORD'),
          );

          cy.visit(protectedRoute.route);
          cy.location('pathname').should(
            'eq',
            typeof protectedRoute?.redirectTo === 'function'
              ? protectedRoute.redirectTo(notAllowedRole)
              : protectedRoute?.redirectTo ?? '/dashboard',
          );
        });
      });

      Cypress._.each(allowedRoles, (allowedRole) => {
        it(`should not redirect if user is logged in and has a required role: ${allowedRole}`, () => {
          const allowedUser = Cypress._.find(
            users,
            (user) => allowedRole === user.role,
          );

          cy.log(
            `Trying to access with a user with role of ${allowedUser?.role}`,
          );

          cy.login(allowedUser?.email || '', Cypress.env('E2E_USER_PASSWORD'));
          cy.visit(protectedRoute.route);
          cy.location('pathname').should('eq', protectedRoute.route);
        });
      });
    });
  });
});
