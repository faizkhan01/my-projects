import { useState } from 'react';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const KEY_DOWN = 'keydown';
const TAB = 'Tab';
const SHIFT = 'Shift';

export const useDrawerToggle = () => {
  const [drawerAnchor, setDrawerAnchor] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === KEY_DOWN &&
        ((event as React.KeyboardEvent).key === TAB ||
          (event as React.KeyboardEvent).key === SHIFT)
      ) {
        return;
      }

      setDrawerAnchor({ ...drawerAnchor, [anchor]: open });
    };

  return {
    drawerAnchor,
    toggleDrawer,
  };
};
