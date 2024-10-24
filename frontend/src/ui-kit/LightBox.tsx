import {
  CaretLeft,
  CaretRight,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  X,
} from '@phosphor-icons/react';
import React, { useMemo } from 'react';
import Lightbox, {
  Slide,
  LightboxProps,
  Plugin,
} from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';

interface LightboxComponentProps extends Partial<LightboxProps> {
  slides: Slide[];
  open: boolean;
  disableZoom?: boolean;
  disableThumbnails?: boolean;
  disableCaptions?: boolean;
  disablePlugins?: boolean;
}

const LightboxComponent: React.FC<LightboxComponentProps> = ({
  disableThumbnails,
  disableCaptions,
  disableZoom,
  disablePlugins,
  ...props
}) => {
  const iconSize = 28;

  const plugins = useMemo<Plugin[]>(() => {
    const plugins: Plugin[] = [];

    if (disablePlugins) return plugins;

    if (!disableZoom) {
      plugins.push(Zoom);
    }

    if (!disableThumbnails) {
      plugins.push(Thumbnails);
    }

    if (!disableCaptions) {
      plugins.push(Captions);
    }

    return plugins;
  }, [disableCaptions, disablePlugins, disableThumbnails, disableZoom]);

  return (
    <Lightbox
      render={{
        iconClose: () => <X size={iconSize} />,
        iconZoomIn: () => <MagnifyingGlassPlus size={iconSize} />,
        iconZoomOut: () => <MagnifyingGlassMinus size={iconSize} />,
        iconNext: () => <CaretRight size={iconSize} />,
        iconPrev: () => <CaretLeft size={iconSize} />,
      }}
      carousel={{
        finite: true,
      }}
      plugins={plugins}
      {...props}
    />
  );
};

export default LightboxComponent;
