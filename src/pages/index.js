import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Divider,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import Image from 'next/image';
// import { revalidatePath, revalidateTag } from 'next/cache';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import PostSection from '@/components/PostSection';
import { selectDarkMode } from '../Reducers/darkModeSlice';
import fetchFunction from '@/utils/fetchFunction';

function Hero({ posts }) {
  const router = useRouter();
  console.log('router.isLoading:', router.isReady);

  const darkMode = useSelector(selectDarkMode);
  const [searchTerm, setSearchTerm] = useState('');

  const darkTheme = {
    position: 'relative',
    // minHeight: '80vh',
    padding: '10px',
    backgroundColor: darkMode
      ? 'var(--color-bg-primary-dark)'
      : 'var(--color-bg-primary-light)',
    color: darkMode
      ? 'var(--color-text-primary-dark)'
      : 'var(--color-text-primary-light)',
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Box sx={darkTheme}>
      <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* {console.log(router.events, 'router events')} */}
      {loading && (
        <Backdrop
          open={loading}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <Box sx={darkTheme}>
        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: '90vw',

            paddingTop: '10px',
            paddingBottom: '20px',
            margin: 'auto',
            height: 'auto',
          }}>
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                  fontFamily: 'var(--font-merienda)',
                }}>
                Explore Travelore...!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.7,
                  paddingBottom: '30px',
                  fontSize: { xs: '1rem', md: '1.5rem' },
                }}>
                Where stories brew hot and sweeter than chai...
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            lg={4}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              src={!darkMode ? '/hero.png' : '/mountain.png'}
              alt="hero image"
              width={350}
              height={350}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider id="posts" variant="middle" sx={{ marginBottom: '12vh' }} />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', md: '2rem', lg: '3rem' },
          fontFamily: 'var(--font-merienda)',
          marginLeft: '2%',
        }}>
        Posts
      </Typography>
      <PostSection posts={posts} />
      <Divider variant="middle" sx={{ marginTop: '10%' }} />
      <Box
        sx={{
          textAlign: 'center',
          px: '10%',
          py: '5%',
          backgroundColor: darkMode ? '#15232d' : 'white',
          marginTop: '20px',
          height: 'auto',
          color: darkMode
            ? 'var(--color-text-primary-dark)'
            : 'var(--color-text-primary-light)',
        }}>
        <Typography
          id="about"
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem', lg: '3rem' },
            fontFamily: 'var(--font-merienda)',
          }}>
          About Me
        </Typography>
        <Box sx={{ textAlign: 'justify' }}>
          <Typography variant="body1">
            Hello there! I&apos;m Lakshmi, a passionate explorer and storyteller
            usually found wandering in and outs of Karnataka and curious Indian
            traveler. My journey is a mix of wanderlust and capturing moments.
            Whether it&apos;s chasing sunsets, sipping on a cup of chai, or
            embarking on cultural escapades, I&apos;m here to share my
            adventures with you.
          </Typography>
          <Typography variant="body1" sx={{ marginTop: '16px' }}>
            Join me as I traverse through life, one beautiful destination at a
            time. From the bustling streets of the city to the serene landscapes
            of nature, every step is a new chapter waiting to be written.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-merienda)',
              textAlign: 'center',
              margin: '1%',
            }}>
            I always feel like Travelling is not just making memories but also
            leaving footprints 👣 along the way
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Hero;

export async function getStaticProps() {
  // console.log(process.env.CLOUDINARY_BASE_URL);
  const posts = await fetchFunction(process.env.API_ENDPOINT);
  return {
    props: { posts },
    revalidate: 1,
  };
}
