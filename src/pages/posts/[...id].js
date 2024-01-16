import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  Modal,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import Image from 'next/image';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import EditForm from '../../components/EditForm';
import Layout from '../../components/Layout';
import { selectDarkMode } from '../../Reducers/darkModeSlice';
import 'react-toastify/dist/ReactToastify.css';
import fetchFunction from '@/utils/fetchFunction';

export default function Post({ post, allpost }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

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
      const res = await fetchFunction(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${post.id}`,
        'put',
        editedPost
      );
      console.log('Edit successful:', res);
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
      await fetchFunction(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${post.id}`,
        'delete'
      );
      // console.log('Delete successful');
      setDeleteModalOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };
  const toastifyStyle = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };
  const notifySuccess = (message) => {
    toast.success(message, toastifyStyle);
  };
  const notifyInfo = (message) => {
    toast.info(message, toastifyStyle);
  };
  const buttonStyle = {
    ml: 2,
    color: darkMode ? '#000' : '#fff',
    backgroundColor: darkMode ? '#fff' : '#000',
    ':hover': {
      bgcolor: '#AF5',
      color: darkMode ? '#fff' : '#000',
    },
  };
  const id = +router.query.id[0];

  return (
    <>
      <Layout />
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* {console.log(+router.query.id[0])} */}
      {console.log(post, 'post')}
      {/* {console.log(allpost[+router.query.id[0]],"allpost")} */}
      {console.log(id)}
      <Box
        sx={{
          position: 'relative',
          marginTop: '-50px',
          paddingTop: '80px',
          backgroundColor: darkMode
            ? 'var(--color-bg-primary-dark)'
            : 'var(--color-bg-primary-light)',
          color: darkMode
            ? 'var(--color-text-primary-dark)'
            : 'var(--color-text-primary-light)',
          width: '100%',
          height: 'auto',
          // overflowX: 'hidden',
        }}>
        <Grid
          container
          spacing={3}
          sx={{ width: '70%', margin: '0 auto', textAlign: 'center' }}>
          <Grid item xs={12}>
            <Typography
              gutterBottom
              component="div"
              sx={{
                fontFamily: 'roboto',
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
              }}>
              {post.title}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ position: 'relative', width: '50vw' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '14px',
                marginBottom: '2%',
                fontStyle: 'italic',
                color: darkMode
                  ? 'var(--color-text-primary-dark)'
                  : 'var(--color-text-primary-light)',
              }}>
              Posted on
              {` ${format(new Date(post.createdAt), 'dd/MM/yyyy')} `}
              by{' '}
              <Image
                src={post.avatar || ''}
                alt="Avatar"
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
              />
            </Typography>
            {Array.isArray(post.images) ? (
              <div style={{ position: 'relative' }}>
                <Image
                  src={post.images[currentImage] || ''}
                  alt={post.title}
                  width={500}
                  height={500}
                  priority
                  style={{ height: '100%', width: '100%' }}
                  // objectFit='contain'
                />
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
                  }}>
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
                  }}>
                  <NavigateNextIcon />
                </IconButton>
              </div>
            ) : (
              <Image
                src={post.images}
                alt={post.title}
                width={800}
                height={500}
                style={{ width: '100%', height: '100%', borderRadius: '5px' }}
                priority
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ textAlign: 'justify', textWrap: 'center', my: '5rem' }}>
            <Typography
              variant="body1"
              color={darkMode ? '#fff' : '#000'}
              sx={{
                textTransform: 'sentense',
                lineHeight: '1.6',
              }}>
              {post.description}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10%',
            }}>
            <Button onClick={handleEditClick} sx={buttonStyle}>
              Edit
            </Button>
            <Button
              color="secondary"
              onClick={handleDeleteClick}
              sx={buttonStyle}>
              Delete
            </Button>
          </Grid>

          <Grid
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10%',
              width: '100%',
            }}>
            {allpost[id - 2] && (
              <Grid
                sx={{ textAlign: 'left' }}
                onClick={() =>
                  router.push(`/posts/${+router.query.id[0] - 1}`)
                }>
                <Grid
                  sx={{ transform: 'rotate(180deg)', width: 'fit-content' }}>
                  <Image
                    src={darkMode ? '/right.png' : '/forward.png'}
                    width={50}
                    height={50}
                    alt=""
                  />
                </Grid>
                <Grid>
                  <Typography>PREVIOUS:</Typography>
                  <Typography sx={{ fontFamily: 'var(--font-merienda)' }}>
                    {allpost[id - 2].title.slice(0, 20) + '...'}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {allpost[id] && (
              <Grid
                sx={{
                  textAlign: 'right',
                  justifyContent: 'flex-end',
                  width: '-webkit-fill-available',
                }}
                onClick={() => router.push(`/posts/${id + 1}`)}>
                <Grid>
                  <Image
                    src={darkMode ? '/right.png' : '/forward.png'}
                    width={50}
                    height={50}
                    alt=""
                  />
                </Grid>
                <Grid>
                  <Typography>NEXT:</Typography>
                  <Typography sx={{ fontFamily: 'var(--font-merienda)' }}>
                    {allpost[id].title.slice(0, 20) + '...'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        {/* EditForm modal */}
        <EditForm
          open={isEditModalOpen}
          onClose={handleEditFormClose}
          onConfirm={handleEditFormConfirm}
          post={post}
        />

        <Modal
          open={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-confirmation-modal"
          aria-describedby="delete-confirmation-modal-description">
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              p: 3,
              textAlign: 'center',
            }}>
            <Typography variant="h6" id="delete-confirmation-modal">
              Are you sure you want to delete this post?
            </Typography>
            <Button
              color="primary"
              onClick={() => {
                handleDeleteConfirm();
                notifySuccess(`Delete on ${post.id}nd POST is successfull`);
              }}
              sx={{ mt: 2, mr: 2 }}>
              Confirm
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                handleDeleteCancel();
                notifyInfo(`Delete on ${post.id}nd POST was not made`);
              }}
              sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Box>
        </Modal>
      </Box>
      <ToastContainer />
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
  const post = await fetchFunction(`${process.env.API_ENDPOINT}/${id}`);
  const allpost = await fetchFunction(`${process.env.API_ENDPOINT}`);
  // const post = res.data;
  // console.log('[...id].js', post);
  return {
    props: { post: post, allpost: allpost },
    revalidate: 2,
  };
}
