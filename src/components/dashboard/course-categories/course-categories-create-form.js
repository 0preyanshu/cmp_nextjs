'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
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
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import axios from 'axios';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import { get } from 'http';
import {HOST_API} from '@/config'

const S3_URL = HOST_API;

const schema = zod.object({
  avatar: zod.string().optional(),
  categoryname: zod.string().min(1, 'Name is required').max(255),
  categoryshortname: zod.string().min(1, 'Short name is required').max(255),
});

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error converting file to base64'));
  });
}

export function CourseCategoriesCreateForm() {
  const [currentCategory, setCurrentCategory] = React.useState({});
  const { allCategories } = useSelector((state) => state?.categories?.categories);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { createCategories, updatecategories } = CourseCategoryActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    avatar: currentCategory?.categoryLogo || '',
    categoryname: currentCategory?.courseCategoryName || '',
    categoryshortname: currentCategory?.categoryShortName || '',
  }), [currentCategory]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    reset(defaultValues);
  }, [currentCategory, reset, defaultValues]);

  React.useEffect(() => {
    if (allCategories?.length && id) {
      const data = allCategories.find((category) => String(category?.id) === String(id));
      setCurrentCategory(data);
    }
  }, [allCategories, id]);

  const fieldMapping = {
    avatar: 'categoryLogo',
    categoryname: 'courseCategoryName',
    categoryshortname: 'categoryShortName'
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentCategory[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }

    changedFields.id = currentCategory.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);

        if (isEdit) {
          await dispatch(updatecategories(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.coursecategories.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createCategories(data)).then((res) => {
            console.log(res?.payload?.data);
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.coursecategories.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCategory.id, dispatch, router, updatecategories, createCategories]
  );

  const avatarInputRef = React.useRef(null);
  const avatar = watch('avatar');

  const [dataUrl, setDataUrl] = React.useState(""); 
  const [isImageUploading, setIsImageUploading] = React.useState(false);

  const getAvatarSrc = (avatar) => {
    return avatar?.startsWith('http') || avatar?.startsWith('http')   ? avatar : dataUrl|| avatar;
  };

  const handleAvatarChange = React.useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png','image/webp'];
        if (!validImageTypes.includes(file.type)) {
          toast.error('Only PNG , JPEG and WEBP images are allowed');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const dataurl = reader.result;
          setDataUrl(dataurl);
          setIsImageUploading(true);
          try {
            const imageId = `image-${Date.now()}`;
            const token = localStorage.getItem('custom-auth-token');
            console.log('Token:', token); // Check if the token is correctly retrieved
            
            // Add headers to the axios.get request
            const { data } = await axios.get(`${S3_URL}/s3-signed-url/upload/${imageId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
  
            // Add headers to the axios.put request
            await axios.put(data?.data?.s3SignedUrl, file, {
              headers: {
                'Content-Type': file.type,
                // Authorization: `Bearer ${token}`
              },
            });
            
            setValue('avatar', imageId);
            toast.success('Image uploaded successfully');
          } catch (err) {
            console.error(err); // Ensure logger is defined
            toast.error('Failed to upload image');
          } finally {
            setIsImageUploading(false);
          }
        };
        reader.onerror = () => {
          toast.error('Failed to read file');
        };
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
                        src={getAvatarSrc(avatar)}
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
                        onClick={() => avatarInputRef.current?.click()}
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
                    name="categoryname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.categoryname)} fullWidth>
                        <InputLabel required>Category Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.categoryname && <FormHelperText>{errors.categoryname.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="categoryshortname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.categoryshortname)} fullWidth>
                        <InputLabel required>Category Short Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.categoryshortname && <FormHelperText>{errors.categoryshortname.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.coursecategories.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting || isImageUploading}
          >
            {!isEdit ? 'Create Course Category' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
  