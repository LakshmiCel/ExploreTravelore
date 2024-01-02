import React, { useState } from 'react';
import { format } from 'date-fns';
import { Typography, TextField, Button, Container, Grid } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { selectDarkMode } from '@/Reducers/darkModeSlice';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar: '', 
    images: '', 
  });

  const router = useRouter();
  const darkMode = useSelector(selectDarkMode);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      const file = e.target.files[0];
      handleImageUpload(name, file);
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageUpload = async (field, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'postTravel');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dsyplkvow/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setFormData((prevFormData) => ({
        ...prevFormData,
        [field]: data.secure_url,
      }));
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
      const response = await axios.post('https://6564a1a2ceac41c0761e90ac.mockapi.io/api/v1/blogs', {
        ...formData,
        createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
      });
      notifySuccess("successfully created new post will be redirected to the post in few seconds")

      const data = response.data;
      console.log('API Response:', data);

      router.push(`/posts/${data.id}`);
    } catch (error) {
      console.error('Error submitting form to API', error);
    }
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

  return (
    <>
      <Layout />
      <Container
        sx={{
          backgroundColor: darkMode ? 'var(--color-bg-primary-dark)' : 'var(--color-bg-primary-light)',
          color: darkMode ? 'var(--color-text-primary-dark)' : 'var(--color-text-primary-light)',
          width: '100%',
          height: '100vh',
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Create Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Title" type="text" name="title" value={formData.title} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline rows={4} name="description" value={formData.description} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" id="avatar" type="file" name="avatar" onChange={(e) => handleChange(e)} style={{ display: 'none' }} />
              <label htmlFor="avatar">
                <Button variant="contained" startIcon={<PhotoCamera />} onClick={() => handleFileButtonClick('avatar')}>
                  Upload Avatar
                </Button>
              </label>
              {formData.avatar && <Typography>{formData.avatar.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <input accept="image/*" id="images" type="file" name="images" onChange={(e) => handleChange(e)} style={{ display: 'none' }} />
              <label htmlFor="images">
                <Button variant="contained" startIcon={<PhotoCamera />} onClick={() => handleFileButtonClick('images')}>
                  Upload Images
                </Button>
              </label>
              {formData.images && <Typography>{formData.images.name}</Typography>}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <ToastContainer/>
    </>
  );
};

export default CreatePost;
