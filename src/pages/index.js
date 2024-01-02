// components/Hero.js
import React, { useState } from 'react';
import { Typography, Box ,Grid} from '@mui/material';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import PostSection from '@/components/PostSection';
import { toggleDarkMode, selectDarkMode } from '../Reducers/darkModeSlice';

import Image from "next/image"
const Hero = ({ posts }) => {
 
  const darkMode = useSelector(selectDarkMode);
  const [searchTerm, setSearchTerm] = useState('');

  const darkTheme={position: 'relative',
  minHeight: '100vh',
  padding: '10px',
  backgroundColor: darkMode ? 'var(--color-bg-primary-dark)' : 'var(--color-bg-primary-light)',
  color: darkMode ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary-light)',}

  return (
    <Box
      sx={darkTheme}
    >
      <Layout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    
    <Box
    sx={darkTheme}
  >
    <Grid container spacing={2} sx={{ maxWidth: '1300px', paddingTop: '20px', paddingBottom: '20px', margin: 'auto' }}>
      <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2rem', md: '3rem',lg:'4rem' },
              fontFamily: 'var(--font-merienda)',
            }}
          >
            Explore Travelore...!
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.7, paddingBottom: '30px', fontSize: { xs: '1rem', md: '1.5rem' } }}
          >
            Where stories brew hot and sweeter than chai...
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={5} lg={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Image src={darkMode ? '/hero.png' : '/hero.png'} alt="hero image" width={400} height={400} />
      </Grid>
    </Grid>
  </Box>
    <PostSection posts={posts}  />

      <Box sx={{ padding: '20px', backgroundColor: darkMode ? '#15232d' : 'white', marginTop: '20px' }}>
        <Typography variant="h4" sx={{ color: darkMode ? '#e3e3e3' : 'inherit' }}>Footer Section</Typography>
      </Box>
    </Box>
  );
};

export default Hero;

export async function getStaticProps() {
  const response = await fetch('https://6564a1a2ceac41c0761e90ac.mockapi.io/api/v1/blogs');
  const posts = await response.json();

  return {
    props: { posts },
  };
}
