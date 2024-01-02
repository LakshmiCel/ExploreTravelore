import React, { useState } from 'react';
import { Grid, Typography, Box, Paper, IconButton, Button, Modal } from '@mui/material';
import Image from 'next/image';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import axios from 'axios';
import { useRouter } from 'next/router';
import EditForm from '../../components/EditForm';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../../Reducers/darkModeSlice';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Post({ post }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

  const handlePrevClick = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : post?.images?.length - 1));
  };

  const handleNextClick = () => {
    setCurrentImage((prev) => (prev < post?.images?.length - 1 ? prev + 1 : 0));
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditFormClose = () => {
    setEditModalOpen(false);
  };

  const handleEditFormConfirm = async (editedPost) => {
    try {
      const res = await axios.put(`https://6564a1a2ceac41c0761e90ac.mockapi.io/api/v1/blogs/${post.id}`, editedPost);
      console.log('Edit successful:', res.data);
      setEditModalOpen(false);
      router.push(`/posts/${post.id}`);
    } catch (error) {
      console.error('Edit failed:', error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://6564a1a2ceac41c0761e90ac.mockapi.io/api/v1/blogs/${post.id}`);
      console.log('Delete successful');
      setDeleteModalOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };
  const toastifyStyle={
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }
  const notifySuccess = (message) => {
    toast.success(message, toastifyStyle);
  };
  const notifyInfo = (message) => {
    toast.info(message, toastifyStyle);
  };

  return (
    <>
      <Layout />
      <Box
        sx={{
          position: 'relative',
          marginTop: '-50px',
          paddingTop: '80px',
          backgroundColor: darkMode ? 'var(--color-bg-primary-dark)' : 'var(--color-bg-primary-light)',
          color: darkMode ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary-light)',
          width: '100%',
          // overflowX: 'hidden',
        }}
      >
        <Grid container spacing={3} sx={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
          <Grid item xs={12}>
            <Typography gutterBottom component="div" sx={{ fontFamily: 'roboto', fontSize: { xs: '1rem', md: '1.5rem', lg: '4rem' } }}>
              {post.title}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ position: 'relative', overflow: 'hidden' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '14px', marginBottom: '2%', fontStyle: 'italic', color: darkMode ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary-light)' }}
            >
              `Posted on
              {' ' + format(new Date(post.createdAt), 'dd/MM/yyyy') + ' '}
              by <Image src={post.avatar} alt="Avatar" width={24} height={24} style={{ borderRadius: '50%', height: '24px', width: '24px' }} />
            </Typography>
            {Array.isArray(post.images) ? (
              <div style={{position:'relative'}}>
                <Image src={post.images[currentImage]} alt={post.title} width={800} height={500} priority />
                <IconButton
  onClick={handlePrevClick}
  sx={{
    position: 'absolute',
    top: '50%',
    left: 0,
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    zIndex: 1,
  }}
>
  <NavigateBeforeIcon />
</IconButton>
<IconButton
  onClick={handleNextClick}
  sx={{
    position: 'absolute',
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    zIndex: 1,
  }}
>
  <NavigateNextIcon />
</IconButton>

              </div>
            ) : (
              <Image src={post.images} alt={post.title} width={800} height={500} priority />
            )}
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'left', paddingBottom: '5' }}>
            <Paper elevation={3} sx={{ mt: 3 }}>
              <Typography variant="body1" color="text.primary" sx={{ padding: '20px', textTransform: 'sentense', lineHeight: '1.6' }}>
                {post.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10%' }}>
            <Button color="primary" onClick={handleEditClick} sx={{ ml: 2 }}>
              Edit
            </Button>
            <Button color="secondary" onClick={handleDeleteClick} sx={{ ml: 2 }}>
              Delete
            </Button>
          </Grid>
        </Grid>

        {/* EditForm modal */}
        <EditForm open={isEditModalOpen} onClose={handleEditFormClose} onConfirm={handleEditFormConfirm} post={post} />

        <Modal open={isDeleteModalOpen} onClose={handleDeleteCancel} aria-labelledby="delete-confirmation-modal" aria-describedby="delete-confirmation-modal-description">
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" id="delete-confirmation-modal">
              Are you sure you want to delete this post?
            </Typography>
            <Button color="primary" onClick={()=>{handleDeleteConfirm(); notifySuccess(`Delete on ${post.id}nd POST is successfull`)}} sx={{ mt: 2, mr: 2 }}>
              Confirm
            </Button>
            <Button color="secondary" onClick={()=>{handleDeleteCancel(); notifyInfo(`Delete on ${post.id}nd POST was not made`)}} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Box>
        </Modal>
      </Box>
      <ToastContainer/>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: ['1'] } }, { params: { id: ['2'] } }],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const id = params.id.join(' ');
  const res = await axios.get(`https://6564a1a2ceac41c0761e90ac.mockapi.io/api/v1/blogs/${id}`);
  const post = res.data;
  return {
    props: { post },
    revalidate: 2,
  };
}
