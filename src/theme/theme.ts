import { createTheme } from '@mui/material/styles';

// module extension to add a new color
declare module '@mui/material/styles' {
  interface Palette {
    invert: Palette['primary'];
  }
  interface PaletteOptions {
    invert: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		invert: true;
	}
}

/**
 * Application theme configuration.
 */
const theme = createTheme({
	palette: {
		primary: {
			main: '#F49039',
			light: '#F7B174',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#399DF4',
			contrastText: '#ffffff',
		},
		background: {
			default: '#F5F5F5',
		},
    invert: {
      main: '#ffffff',
      contrastText: '#F49039',
    }
	},
});

export default theme;
