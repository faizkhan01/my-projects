import { SVGProps } from 'react';

export const YoutubeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <g clipPath="url(#clip0_1259_23411)">
      <path
        stroke="#fff"
        fill="transparent"
        d="M16 .5C24.56.5 31.5 7.44 31.5 16c0 8.56-6.94 15.5-15.5 15.5C7.44 31.5.5 24.56.5 16 .5 7.44 7.44.5 16 .5z"
      ></path>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M23.885 12.373A2.377 2.377 0 0021.512 10H10.373A2.377 2.377 0 008 12.373v6.368a2.377 2.377 0 002.373 2.373h11.139a2.377 2.377 0 002.373-2.373v-6.368zm-9.54 5.86v-5.981l4.527 2.978-4.528 3.003z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_1259_23411">
        <path fill="#fff" d="M0 0H32V32H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
