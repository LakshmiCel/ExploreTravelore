import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import { format } from 'date-fns';

function PostsSection({ posts }) {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1%',
        marginTop: '10px',
        width: '90vw',
        margin: '0 auto',
      }}>
      {posts.map((post) => (
        <Grid item key={post.id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 8,
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '300px',
              maxHeight: '400px',
              justifyContent: 'space-around',
              margin: '10px',
            }}>
            <div
              style={{
                position: 'relative',
                height: 0,
                paddingBottom: '60%',
                overflow: 'hidden',
              }}>
              {console.log(post)}
              <Image
                src={Array.isArray(post.images) ? post.images[0] : post.images}
                alt={post.title}
                layout="fill"
                objectFit="cover"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  width: '100%',
                  color: '#fff',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                  '@media (max-width: 600px)': {
                    display: 'none',
                  },
                }}>
                <Typography variant="h5" fontWeight={700} sx={{ margin: 0 }}>
                  {post.title}
                </Typography>
              </div>
            </div>

            <CardContent sx={{ flexGrow: 1, padding: 3 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  margin: 0,
                  '@media (min-width: 600px)': { display: 'none' },
                }}>
                {post.title}
              </Typography>

              <Typography
                gutterBottom
                variant="subtitle2"
                color="textSecondary">
                {format(new Date(post.createdAt), 'dd/MM/yyyy')}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  justifyContent: 'center',
                }}>
                <Image
                  src={post.avatar}
                  alt="Avatar"
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', height: '24px', width: '24px' }}
                />
              </div>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ marginBottom: 2 }}>
                {post.description.slice(0, 100)}...
                <Link href={`/posts/${post.id}`} passHref>
                  <Button>Read More</Button>
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default PostsSection;
