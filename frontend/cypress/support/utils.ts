export const realPhoneNumber = '+14342997440';

export const isMobile = () => {
  return (
    Cypress.config('viewportWidth') <
    Cypress.env('mobileViewportWidthBreakpoint')
  );
};
