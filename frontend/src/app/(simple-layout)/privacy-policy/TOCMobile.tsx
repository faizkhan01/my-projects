import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CaretRight, X } from '@phosphor-icons/react';
// import TimelineDot from '@mui/lab';
// import TimelineItem from '@mui/lab';
// import TimelineContent from '@mui/lab';

interface Section {
  heading: string;
  boundingTop: number;
  isActive: boolean;
}

const marginTop = 0;

const TOCMobile = () => {
  const [offsetY, setoffsetY] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);

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

  const [expended, setExpended] = useState(false);
  return (
    <Box
      sx={{
        background: 'white',
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        top: expended ? '0' : '',
        padding: '16px',
        display: { md: 'none' },
      }}
    >
      <Box
        sx={{
          background: '#F6F9FF',
          padding: '17px 12px 17px 24px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: !expended ? 'center' : 'flex-start',
          justifyContent: 'space-between',
          height: expended ? 'calc(100vh - 64px)' : '',
        }}
      >
        <Box sx={{ maxWidth: 'calc(100% - 50px)' }}>
          {sections?.map((section: Section) => (
            <Box key={section.heading}>
              <Typography
                onClick={() => {
                  window.scrollTo(0, section.boundingTop - marginTop);
                  setoffsetY(section.boundingTop - marginTop + 10);
                  setExpended(false);
                }}
                sx={{
                  overflow: 'hidden',
                  color: '#5F59FF',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {section.isActive && section.heading}
              </Typography>
              <Typography
                onClick={() => {
                  window.scrollTo(0, section.boundingTop - marginTop);
                  setoffsetY(section.boundingTop - marginTop + 10);
                  setExpended(false);
                }}
                sx={{
                  overflow: 'hidden',
                  color: '#333E5C',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {expended && !section.isActive && section.heading}
              </Typography>
            </Box>
          ))}
        </Box>
        {!expended ? (
          <Box
            onClick={() => setExpended(true)}
            sx={{
              height: '32px',
              width: '32px',
              background: 'white',
              borderRadius: '90px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px',
            }}
          >
            <CaretRight size={18} color="#5F59FF" weight="bold" />
          </Box>
        ) : (
          <Box
            onClick={() => setExpended(false)}
            sx={{
              height: '32px',
              width: '32px',
              background: 'white',
              borderRadius: '90px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '10px',
            }}
          >
            <X size={18} color="#5F59FF" weight="bold" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TOCMobile;
