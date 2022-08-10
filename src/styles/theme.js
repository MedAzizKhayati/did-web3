import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export default extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: 'linear-gradient(90deg, rgba(198, 198, 198, 1) 0%, rgba(240, 240, 240, 1) 45%, rgba(205, 205, 205, 1) 100%)'
      }
    })
  }
});
