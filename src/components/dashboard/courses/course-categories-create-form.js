'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Error converting file to base64'));
    };
  });
}

const schema = zod.object({
  avatar: zod.string().optional(),
  coursename: zod.string().min(1, 'Name is required').max(255),
  courseshortname: zod.string().min(1, 'Short name is required').max(255),
  category: zod.string().min(1, 'Category is required').max(255),
  courseurl: zod.string().min(1, 'URL is required').max(255),
});

const defaultValues = {
  avatar: '',
  coursename: '',
  courseshortname: '',
  category: '',
  courseurl: '',
};

export function CustomerCreateForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        // Make API request
        toast.success('Customer updated');
        router.push(paths.dashboard.courses.list);
      } catch (err) {
        logger.error(err);
        toast.error('Something went wrong!');
      }
    },
    [router]
  );

  const avatarInputRef = React.useRef(null);
  const avatar = watch('avatar');

  const handleAvatarChange = React.useCallback(
    async (event) => {
      const file = event.target.files?.[0];

      if (file) {
        const url = await fileToBase64(file);
        setValue('avatar', url);
      }
    },
    [setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        border: '1px dashed var(--mui-palette-divider)',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        p: '4px',
                      }}
                    >
                      <Avatar
                        src={avatar}
                        sx={{
                          '--Avatar-size': '100px',
                          '--Icon-fontSize': 'var(--icon-fontSize-lg)',
                          alignItems: 'center',
                          bgcolor: 'var(--mui-palette-background-level1)',
                          color: 'var(--mui-palette-text-primary)',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <CameraIcon fontSize="var(--Icon-fontSize)" />
                      </Avatar>
                    </Box>
                    <Stack spacing={1} sx={{ alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1">Avatar</Typography>
                      <Typography variant="caption">Min 400x400px, PNG or JPEG</Typography>
                      <Button
                        color="secondary"
                        onClick={() => {
                          avatarInputRef.current?.click();
                        }}
                        variant="outlined"
                      >
                        Select
                      </Button>
                      <input hidden onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="coursename"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.coursename)} fullWidth>
                        <InputLabel required>Course Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.coursename ? <FormHelperText>{errors.coursename.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="courseshortname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.courseshortname)} fullWidth>
                        <InputLabel required>Course Short Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.courseshortname ? <FormHelperText>{errors.courseshortname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.category)} fullWidth>
                        <InputLabel required>Category</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">
                            <>Select Category</>
                          </MenuItem>
                          <MenuItem value="category1">Category 1</MenuItem>
                          <MenuItem value="category2">Category 2</MenuItem>
                          <MenuItem value="category3">Category 3</MenuItem>
                        </Select>
                        {errors.category ? <FormHelperText>{errors.category.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="courseurl"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.courseurl)} fullWidth>
                        <InputLabel required>Course URL</InputLabel>
                        <OutlinedInput {...field} placeholder="https://courseurl.example.com" />
                        {errors.courseurl ? <FormHelperText>{errors.courseurl.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.courses.list}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Course
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
