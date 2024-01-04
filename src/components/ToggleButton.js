import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode, selectDarkMode } from '@/Reducers/darkModeSlice';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage:
          'url(https://www.iconpacks.net/icons/3/free-icon-moon-6695.png)',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage:
        'url(https://www.iconpacks.net/icons/free-icons-6/free-icon-light-mode-sun-yellow-circle-20616.png)',
      backgroundSize: 'contain',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 10,
  },
}));

export default function CustomizedSwitches() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <FormGroup onClick={handleDarkModeToggle}>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} checked={darkMode} />}
      />
    </FormGroup>
  );
}
