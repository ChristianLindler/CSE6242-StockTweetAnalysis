/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    // Disable variants that aren't used to reduce CSS size
    variants: {
      extend: {},
    },
    // Only include used utilities
    corePlugins: {
      container: true,
      backgroundColor: true,
      borderColor: true,
      borderRadius: true,
      display: true,
      divideColor: false,
      divideWidth: false,
      flexDirection: true,
      fontFamily: false,
      fontSize: true,
      fontStyle: false,
      fontWeight: true,
      gridAutoFlow: false,
      gridColumn: false,
      gridColumnEnd: false,
      gridColumnStart: false,
      gridRow: false,
      gridRowEnd: false,
      gridRowStart: false,
      gridTemplateColumns: true,
      gridTemplateRows: false,
      height: true,
      inset: false,
      justifyContent: true,
      letterSpacing: false,
      lineHeight: false,
      listStyleType: false,
      margin: true,
      maxHeight: true,
      maxWidth: true,
      minHeight: true,
      minWidth: true,
      objectFit: false,
      objectPosition: false,
      opacity: true,
      order: false,
      outline: false,
      overflow: true,
      padding: true,
      placeholderColor: false,
      space: false,
      stroke: false,
      strokeWidth: false,
      tableLayout: false,
      textAlign: true,
      textColor: true,
      textDecoration: false,
      textTransform: false,
      userSelect: false,
      verticalAlign: false,
      visibility: false,
      whitespace: true,
      width: true,
      wordBreak: false,
      zIndex: true,
    },
    // Purge unused styles in production
    purge: {
      enabled: process.env.NODE_ENV === 'production',
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './index.html',
      ],
    },
  }