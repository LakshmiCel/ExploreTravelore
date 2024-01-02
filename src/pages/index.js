import React, { useState } from 'react';
import { Typography, Box ,Grid,Divider} from '@mui/material';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import PostSection from '@/components/PostSection';
import { selectDarkMode } from '../Reducers/darkModeSlice';

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
    <Box sx={darkTheme} >
      <Layout
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    
    <Box sx={darkTheme} >
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
  <Divider id={'posts'} variant="middle" sx={{ marginBottom: '10%' }} />
  <Typography  variant="h4" gutterBottom  sx={{
              fontSize: { xs: '1.5rem', md: '2rem',lg:'3rem' },
              fontFamily: 'var(--font-merienda)',marginLeft:'2%'
            }}>
          Posts
        </Typography>
    <PostSection posts={posts}  />
    <Divider variant="middle" sx={{ marginTop: '10%' }} />
      <Box sx={{textAlign: 'center',  px: '10%', py:'5%', backgroundColor: darkMode ? '#15232d' : 'white', marginTop: '20px' , color: darkMode ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary-light)',}}>
     
    
      
        <Typography id={'about'} variant="h4" gutterBottom  sx={{
              fontSize: { xs: '1.5rem', md: '2rem',lg:'3rem' },
              fontFamily: 'var(--font-merienda)'
            }}>
          About Me
        </Typography>
        <Box sx={{textAlign:'justify'}}>
          <Typography variant="body1">
            Hello there! I`&apos;`m Lakshmi, a passionate explorer and storyteller usually found wandering in and outs of Karnataka and curious Indian travelor. 
            My journey is a mix of wanderlust and capturing moments. Whether it`&apos;`s chasing sunsets, sipping on a cup of chai, or
            embarking on cultural escapades, I`&apos;`m here to share my adventures with you.
          </Typography>
          <Typography variant="body1" sx={{ marginTop: '16px' }}>
            Join me as I traverse through life, one beautiful destination at a time. From the bustling streets of the
            city to the serene landscapes of nature, every step is a new chapter waiting to be written. 
          </Typography>
          <Typography variant="body1" sx={{fontFamily:'var(--font-merienda)', textAlign:'center',margin:'1%'}}>
            I always feel like Travelling is not just making memories but also leaving footprints 👣 along way 
          </Typography>
        </Box>
     
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
    revalidate: 2,
  };
}
