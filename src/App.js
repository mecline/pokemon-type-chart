import React from 'react';
import './App.css';
import PokeInfo from './components/PokeInfo'
// import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

// const theme = createMuiTheme();

// const useStyles = makeStyles((theme) => {
//   root: {
//     // some CSS that accesses the theme
//   }
// });

function App() {
  return (
    // <ThemeProvider theme={theme}>
    <div>
      <PokeInfo />
    </div>
    // </ThemeProvider>
  );
}

export default App;
