const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(70.06deg, #2cccff -5%, #22dfbf 106%)',
        'custom': `
          radial-gradient(#ffffff40, #fff0 40%), radial-gradient(hsl(44, 100%, 66%) 30%, hsl(338, 68%, 65%), hsla(338, 68%, 65%, .4) 41%, transparent 52%), radial-gradient(hsl(272, 100%, 60%) 37%, transparent 46%), linear-gradient(155deg, transparent 65%, hsl(142, 70%, 49%) 95%), linear-gradient(45deg, #0065e0, #0f8bff);
        `,
      },
    },
  },
};

export default config;
