// components/EditForm.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchFunction from '@/utils/fetchFunction';

function EditForm({ post, open, onClose, onConfirm }) {
  const [editedPost, setEditedPost] = useState({ ...post });
  const [avatarFile, setAvatarFile] = useState(null);
  const [imagesFiles, setImagesFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];

    if (type === 'avatar') {
      setAvatarFile(file);
    } else if (type === 'images') {
      setImagesFiles([...imagesFiles, file]);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'postTravel');

    try {
      const response = await fetchFunction(
        process.env.NEXT_PUBLIC_CLOUDINARY_API_URL,
        'post',
        formData
      );

      const data = await response.json();

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
  };
  const notifyInfo = (message) => {
    toast.info(message, toastifyStyle);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="title">Title</InputLabel>
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
            <InputLabel htmlFor="description">Description</InputLabel>
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
          {avatarFile && <Typography>{avatarFile.name}</Typography>}

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
          {imagesFiles.map((file, index) => (
            <Typography key={index}>{file.name}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
              notifyInfo('No changes are made through Edit');
            }}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              const avatarUrl = avatarFile
                ? await handleImageUpload(avatarFile)
                : null;
              const imagesUrls = await Promise.all(
                imagesFiles.map(handleImageUpload)
              );

              const editedData = {
                ...editedPost,
                avatar: avatarUrl || editedPost.avatar,
                images: imagesUrls.length > 0 ? imagesUrls : editedPost.images,
              };

              onConfirm(editedData);
              notifySuccess('Changes edited are saved successfully');
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
