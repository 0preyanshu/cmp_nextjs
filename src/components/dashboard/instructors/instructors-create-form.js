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

import { InstructorActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import {HOST_API} from '@/config';

const S3_URL = HOST_API;

const schema = zod.object({
  avatar: zod.string().optional(),
  firstname: zod.string().min(1, 'First Name is required').max(255),
  lastname: zod.string().min(1, 'Last Name is required').max(255),
  email: zod.string().email('Invalid email').min(1, 'Email is required').max(255),
  phone: zod.string().regex(/^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/, 'Phone number is not valid').min(1, 'Phone number is required'),
});

export function InstructorsCreateForm() {
  const [currentInstructor, setCurrentInstructor] = React.useState({});

  const { allInstructors } = useSelector((state) => state?.instructors?.instructors);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { fetchInstructor, createInstructor, updateInstructor } = InstructorActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    avatar: currentInstructor?.photo || 'samplephoto',
    firstname: currentInstructor?.firstname || '',
    lastname: currentInstructor?.lastname || '',
    email: currentInstructor?.email || '',
    phone : currentInstructor?.phone || '',
  }), [currentInstructor]);

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
  }, [currentInstructor, reset, defaultValues]);

  React.useEffect(() => {
    if (allInstructors?.length && id) {
      const data = allInstructors.find((instructor) => String(instructor?.id) === String(id));
      setCurrentInstructor(data);
    }
  }, [allInstructors, id]);

  const fieldMapping = {
    avatar: "photo",
    firstname: "firstname",
    lastname: "lastname",
    email: "email",
    phone: "phone",
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentInstructor[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }

    changedFields.id = currentInstructor.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);

        if (isEdit) {
          await dispatch(updateInstructor(changedData)).then((res) => {
            if (res?.payload?.data?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.instructors.list);
            } else {
              toast.error(res?.payload?.data?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createInstructor(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.instructors.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentInstructor.id, dispatch, router, fetchInstructor, updateInstructor, createInstructor]
  );

  const avatarInputRef = React.useRef(null);
  const avatar = watch('avatar');

  const [dataUrl, setDataUrl] = React.useState("");
  const [isImageUploading, setIsImageUploading] = React.useState(false);

  const getAvatarSrc = (avatar) => {
    return avatar?.startsWith('http') || avatar?.startsWith('http') ? avatar : dataUrl || avatar;
  };

  const handleAvatarChange = React.useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png','image/webp'];
        if (!validImageTypes.includes(file.type)) {
          toast.error('Only PNG or JPEG images are allowed');
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
            const { data } = await axios.get(`${S3_URL}/s3-signed-url/upload/${imageId}`,{
              headers: { Authorization: `Bearer ${localStorage.getItem('custom-auth-token')}` },
            });
            await axios.put(data?.data?.s3SignedUrl, file, {
              headers: {
                'Content-Type': file.type,
              },
            });
            setValue('avatar', imageId);
            toast.success('Image uploaded successfully');
          } catch (err) {
            logger.error(err);
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
                    name="firstname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.firstname)} fullWidth>
                        <InputLabel required>First Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.firstname ? <FormHelperText>{errors.firstname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="lastname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.lastname)} fullWidth>
                        <InputLabel required>Last Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.lastname ? <FormHelperText>{errors.lastname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)} fullWidth>
                        <InputLabel required>Email</InputLabel>
                        <OutlinedInput {...field} type='email' />
                        {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.phone)} fullWidth>
                        <InputLabel required>Phone</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.instructors.list}>
            Cancel
          </Button>
          <LoadingButton
            color="primary"
            loading={isSubmitting || isImageUploading}
            type="submit"
            variant="contained"
            disabled={isImageUploading}
          >
            {isEdit ? 'Update' : 'Create'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
