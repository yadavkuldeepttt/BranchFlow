/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // "bg-white": "#ece3ca",
        //   "hover-danger": "#d91427",
        // "green":"#008000"
      },
      screens: {
        sm: { 'max': '600px' },
         md: { 'max': '1020px' },
         lg: { 'min':'1021px', 'max': '1290px' },
         xl: { 'max':'1500px'},
        
      },
    },
  },

  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          ".bg-white": {
            "background-color": "#1d232a!important",
          },
          '.border-gray-200':{
            "border-color": "#fff!important",
          },
          '.bg-base-100':{
            "color": "#fff!important",
          },
          '.bg-base-200,h3':{
            "color": "#fff!important",
          }
        },
      },
      {
        retro: {
          ...require("daisyui/src/theming/themes")["retro"],
          ".bg-white": {
            "background-color": "#ece3ca!important",
          },
          '.border-gray-200':{
            "border-color": "#333!important",

          }
        },
      },
      "cyberpunk",
      {
        valentine: {
          ...require("daisyui/src/theming/themes")["valentine"],
          ".bg-white": {
            "background-color": "#fae7f4!important",
          },
      
        },
      },
      {
        aqua: {
          ...require("daisyui/src/theming/themes")["aqua"],
          ".bg-white": {
            "background-color": "#345da7!important",
          },
          '.border-gray-200':{
            "border-color": "#fff!important",
          },
          '.bg-base-100':{
            "color": "#fff!important",
          },
          '.bg-base-200,h3':{
            "color": "#fff!important",
          }
        },
      },
    ],
  },
};
// #fae7f4