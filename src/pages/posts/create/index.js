/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Grid,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { selectDarkMode } from '@/Reducers/darkModeSlice';
import 'react-toastify/dist/ReactToastify.css';
import fetchFunction from '@/utils/fetchFunction';

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar: '',
    images: [],
  });

  const [avatarUploadDisabled, setAvatarUploadDisabled] = useState(false);
  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);
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

  const handleChange = (e) => {
    const { name, type } = e.target;

    if (type === 'file') {
      const file = e.target.files[0];
      handleImageUpload(name, file);
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: e.target.value,
    }));
  };

  const handleImageUpload = async (field, file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'postTravel');

    try {
      const data = await fetchFunction(
        process.env.NEXT_PUBLIC_CLOUDINARY_API_URL,
        'post',
        formDataUpload
      );

      if (field === 'avatar') {
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: data.secure_url,
        }));
        setAvatarUploadDisabled(true);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          images:
            prevFormData.images.length > 1
              ? Array.isArray(prevFormData.images)
                ? [...prevFormData.images, data.secure_url]
                : [prevFormData.images, data.secure_url]
              : data.secure_url,
        }));
      }

      notifySuccess(`${field} uploaded successfully!`);
    } catch (error) {
      console.error(`Error uploading image to Cloudinary for ${field}`, error);
    }
  };

  const handleFileButtonClick = (fieldName) => {
    document.getElementById(fieldName).click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchFunction(
        process.env.NEXT_PUBLIC_API_ENDPOINT,
        'post',
        {
          ...formData,
          createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        }
      );
      notifySuccess(
        'successfully created new post will be redirected to the post in few seconds'
      );

      console.log('API Response:', data);

      router.push(`/posts/${data.id}`);
    } catch (error) {
      console.error('Error submitting form to API', error);
    }
  };

  return (
    <>
      {console.log(formData, 'form data')}
      <Layout />
      <Container
        sx={{
          backgroundColor: darkMode
            ? 'var(--color-bg-primary-dark)'
            : 'var(--color-bg-primary-light)',
          color: darkMode
            ? 'var(--color-text-primary-dark)'
            : 'var(--color-text-primary-light)',
          width: '100%',
          height: '100vh',
        }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Create Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Description"
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="avatar"
                type="file"
                name="avatar"
                onChange={(e) => handleChange(e)}
                style={{ display: 'none' }}
                disabled={avatarUploadDisabled}
              />
              <label htmlFor="avatar">
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  onClick={() => handleFileButtonClick('avatar')}
                  disabled={avatarUploadDisabled}>
                  Upload Avatar
                </Button>
                <Box sx={{ margin: '2%' }}>
                  {formData.avatar && (
                    <Image
                      src={formData.avatar}
                      alt="avatar image"
                      width={100}
                      height={100}
                    />
                  )}
                </Box>
              </label>
              {/* {formData.avatar && <Typography>{formData.avatar}</Typography>} */}
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="images"
                type="file"
                name="images"
                onChange={(e) => handleChange(e)}
                style={{ display: 'none' }}
              />
              <label htmlFor="images">
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  onClick={() => handleFileButtonClick('images')}>
                  Upload Images
                </Button>
              </label>
              <Box sx={{ margin: '2%' }}>
                {Array.isArray(formData.images)
                  ? formData.images.map((image, index) => (
                      <Image
                        key={index}
                        alt="image"
                        src={image}
                        width={100}
                        height={100}
                        priority
                      />
                    ))
                  : formData.images && (
                      <Image
                        src={formData.images}
                        alt="image"
                        width={100}
                        height={100}
                        priority
                      />
                    )}
              </Box>

              {/* <Grid sx={{ paddingLeft: '15px' }}>
                {Array.isArray(formData.images) &&
                  formData.images.length > 0 && (
                    <Typography>{formData.images.join(', ')}</Typography>
                  )}
                {typeof formData.images === 'string' &&
                  formData.images.length > 0 
                    // <Typography>{formData.images}</Typography>
                  }
              </Grid> */}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <ToastContainer />
    </>
  );
}

export default CreatePost;
