import React from 'react';
import { render as defaultRender } from '@testing-library/react';
import {
  AppRouterContext,
  AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context';

export * from '@testing-library/react';

// --------------------------------------------------
// Override the default test render with our own
//
// You can override the router mock like this:
//
// const { baseElement } = render(<MyComponent />, {
//   router: { pathname: '/my-custom-pathname' },
// });
// --------------------------------------------------
type DefaultParams = Parameters<typeof defaultRender>;
type RenderUI = DefaultParams[0];
type RenderOptions = DefaultParams[1] & { router?: Partial<AppRouterInstance> };

const mockRouter: AppRouterInstance = {
  refresh: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  forward: jest.fn(),
};

export function render(
  ui: RenderUI,
  { wrapper, router, ...options }: RenderOptions = {},
) {
  if (!wrapper) {
    // eslint-disable-next-line no-param-reassign
    wrapper = ({ children }) => (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <AppRouterContext.Provider value={{ ...mockRouter, ...router }}>
        {children}
      </AppRouterContext.Provider>
    );
  }

  return defaultRender(ui, { wrapper, ...options });
}
