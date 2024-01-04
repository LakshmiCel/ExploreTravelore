import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  MenuItem,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
// import axios from 'axios';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { selectDarkMode } from '../Reducers/darkModeSlice';
import fetchFunction from '@/utils/fetchFunction';
import ToggleButton from './ToggleButton';

export default function Navbar({ searchTerm, setSearchTerm }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchFunction(process.env.NEXT_PUBLIC_API_ENDPOINT);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filterPosts = () => {
      const filtered = posts.filter(
        (post) =>
          post?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          post?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredPosts(filtered);
    };

    filterPosts();
  }, [searchTerm, posts]);

  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        boxShadow: darkMode
          ? '0px 0px 10px rgba(0, 0, 0, 0.8)'
          : '0px 0px 10px rgba(255, 255, 255, 0.5)',
        color: darkMode
          ? 'var(--color-text-primary-dark)'
          : 'var(--color-text-primary-light)',

        boxSizing: 'border-box',
        border: '0 solid #e5e7eb',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        lineHeight: '1.5',
        height: '4rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '1rem',
        transition: 'color 0.3s, box-shadow 0.3s',
      }}>
      {console.log(router.pathname)}
      <Toolbar
        sx={{
          justifyContent: 'space-around',
          width: '100%',
          alignItems: 'center',
        }}>
        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            fontSize: '30px',
            color: 'inherit',
            fontFamily: 'var(--font-merienda)',
            px: '5px',
          }}>
          Travelore
        </Typography>

        <Grid item>
          <Link href="/#about">
            <Button
              sx={{
                color: darkMode
                  ? 'var(--color-text-primary-dark)'
                  : 'var(--color-text-primary-light)',
              }}>
              About Me
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/posts/create" passHref>
            <Button
              sx={{
                color: darkMode
                  ? 'var(--color-text-primary-dark)'
                  : 'var(--color-text-primary-light)',
              }}>
              <PostAddOutlinedIcon />
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href="/#posts" passHref>
            <Button
              sx={{
                color: darkMode
                  ? 'var(--color-text-primary-dark)'
                  : 'var(--color-text-primary-light)',
              }}>
              Posts
            </Button>
          </Link>
        </Grid>

        {router.pathname === '/' && (
          <Grid item>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>

            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ backgroundColor: 'white', borderRadius: '5px' }}
            />
            {searchTerm && filteredPosts.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  zIndex: 1,
                  width: '20%',
                  marginTop: '5px',
                  overflow: 'hidden',
                }}>
                {filteredPosts.map((post) => (
                  <Link href={`/posts/${post.id}`} key={post.id} passHref>
                    <MenuItem
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        minWidth: '200px',
                        backgroundColor: darkMode
                          ? 'var(--color-bg-secondary-dark)'
                          : 'var(--color-bg-secondary-light)',
                      }}>
                      {post.title.length > 20
                        ? `${post.title.slice(0, 20)}...`
                        : post.title}
                    </MenuItem>
                  </Link>
                ))}
              </Paper>
            )}
          </Grid>
        )}

        <ToggleButton />
      </Toolbar>
    </AppBar>
  );
}
