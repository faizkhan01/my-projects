import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

interface Section {
  heading: string;
  boundingTop: number;
  isActive: boolean;
}

const marginTop = 0;

const TOC = () => {
  const [offsetY, setoffsetY] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    setoffsetY(0);
  }, []);

  useEffect(() => {
    const elm: HTMLElement[] = Array.from(
      document.querySelectorAll('section.section-heading'),
    );

    const allSections = elm.map((el: HTMLElement, index: number) => {
      const { top: boundingTop } = el.getBoundingClientRect();

      return {
        heading: el.getAttribute('id')!,
        boundingTop,
        isActive: index === 0,
      };
    });

    setSections(allSections);
  }, []);

  useEffect(() => {
    if (sections.length <= 1) return;

    const onScroll = () => {
      setoffsetY(window.pageYOffset);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [sections]);

  useEffect(() => {
    if (sections.length === 0) return;

    if (sections.length === 1) {
      sections[0].isActive = true;
    }

    sections.forEach((section: Section, index: number) => {
      if (index === 0) {
        section.isActive =
          sections[index + 1].boundingTop > offsetY + marginTop;
      } else {
        if (sections[index + 1]) {
          section.isActive =
            sections[index + 1].boundingTop > offsetY + marginTop &&
            sections[index].boundingTop <= offsetY + marginTop;
        } else {
          section.isActive = sections[index].boundingTop <= offsetY + marginTop;
        }
      }
    });
  }, [sections, offsetY]);

  return (
    <div className="space-y-2">
      {sections?.map((section: Section, index: number) => {
        return (
          <Typography
            key={index}
            sx={{
              fontSize: section.isActive ? '16px' : '14px',
              fontWeight: section.isActive ? '600' : '400',
              color: section.isActive ? '#5F59FF' : '#333E5C',
              lineHeight: '22px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              maxWidth: '312px',
            }}
            onClick={() => {
              push(`${pathname}/#${section.heading}`);
              window.scrollTo(0, section.boundingTop - marginTop);
              setoffsetY(section.boundingTop - marginTop + 10);
            }}
          >
            {section.heading}
          </Typography>
        );
      })}
    </div>
  );
};

export default TOC;
