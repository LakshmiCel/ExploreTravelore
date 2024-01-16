/* eslint-disable @next/next/no-img-element */
// components/EditForm.js
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  Grid,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchFunction from '@/utils/fetchFunction';

function EditForm({ post, open, onClose, onConfirm }) {
  const [editedPost, setEditedPost] = useState({ ...post });
  const [avatarFile, setAvatarFile] = useState('');
  const [imagesFiles, setImagesFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e, type) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    // console.log(file, 'line 29');
    if (type === 'avatar') {
      setAvatarFile(await handleImageUpload(file));
      // notifySuccess('Avatar is uploaded succesfully ...!');
    } else if (type === 'images') {
      const imagesUrls = await handleImageUpload(file);
      console.log(imagesUrls);
      setImagesFiles([...imagesFiles, imagesUrls]);
      // notifySuccess('Image is uploaded succesfully ...!');
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'postTravel');

    try {
      const data = await fetchFunction(
        process.env.NEXT_PUBLIC_CLOUDINARY_API_URL,
        'post',
        formData
      );
      // console.log(data, "inside line 48")

      // const data = await response.json();
      // console.log(response, "line 51")

      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary', error);
      return null;
    }
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
    setImagesFiles([]);
  };
  const notifyInfo = (message) => {
    toast.info(message, toastifyStyle);
  };
  useEffect(() => {
    setEditedPost({ ...post });
  }, [post]);

  return (
    <>
      {/* {console.log(imagesUrls, "image url")} */}
      {/* {console.log(post, 'recieved in edit form')}
      {console.log(imagesFiles, 'image files')} */}
      {console.log(avatarFile, 'vaatr file')}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              fullWidth
              id="title"
              label="Title"
              name="title"
              value={editedPost.title}
              onChange={handleChange}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={editedPost.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
          </FormControl>
          <input
            accept="image/*"
            id="avatar"
            type="file"
            onChange={(e) => handleFileChange(e, 'avatar')}
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar">
            <Button variant="contained" component="span">
              Upload Avatar
            </Button>
          </label>

          {/* {avatarFile && <Typography>{avatarFile.name}</Typography>} */}

          <input
            accept="image/*"
            id="images"
            type="file"
            onChange={(e) => handleFileChange(e, 'images')}
            style={{ display: 'none' }}
            multiple
          />
          <label htmlFor="images">
            <Button variant="contained" component="span">
              Upload Images
            </Button>
          </label>
          {console.log(imagesFiles, 'image files ')}
          {imagesFiles.map((file, index) => (
            <Typography key={index}>{file.name}</Typography>
          ))}
          {avatarFile && (
            <Grid
              sx={{
                m: 2,
                width: '20%',
                height: '10%',
                display: 'flex',
                gap: 2,
              }}>
              <Typography sx={{ fontFamily: 'var(--font-merienda)' }}>
                Avatar uploaded:
              </Typography>
              <img
                src={avatarFile}
                width="100%"
                height="100%"
                alt="avatarImage"
                style={{ borderRadius: '50%' }}
              />
            </Grid>
          )}
          {imagesFiles.length > 0 && (
            <Grid
              sx={{
                m: 3,
                gap: 3,
                width: '20%',
                height: '10%',
                display: 'flex',
              }}>
              <Typography sx={{ fontFamily: 'var(--font-merienda)' }}>
                Images uploaded:
              </Typography>
              {imagesFiles.map((x) => (
                <img src={x} alt="uploaded" width="100%" height="100%" />
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
              notifyInfo('No changes are made through Edit');
              setImagesFiles([]);
              setAvatarFile('');
            }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              // console.log(avatarUrl, "avatar")

              // console.log(imagesUrls[0]);
              const editedData = {
                ...editedPost,
                avatar: avatarFile || editedPost.avatar,
                images: imagesFiles.length > 1 ? imagesFiles : imagesFiles[0],
              };
              console.log(editedPost);
              console.log(editedData, 'line 161');
              onConfirm(editedData);
              notifySuccess('Changes edited are saved successfully');
              setImagesFiles([]);
              setAvatarFile('');
            }}
            color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default EditForm;
