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
import { CoursesActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import { MenuItem, Select } from '@mui/material';
import {HOST_API} from '@/config';

const S3_URL = HOST_API;

const schema = zod.object({
  avatar: zod.string().optional(),
  coursename: zod.string().min(1, 'Name is required').max(255),
  courseshortname: zod.string().min(1, 'Short name is required').max(255),
  category: zod.string().min(1, 'Category is required').max(255),
  courseurl: zod.string().min(1, 'URL is required').max(255),
});

export function CoursesCreateForm() {
  const [currentCourse, setCurrentCourse] = React.useState({});
  const { allCategories } = useSelector((state) => state?.categories?.categories);
  const { allCourses } = useSelector((state) => state?.courses?.courses);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { createCourses, updateCourses, fetchCourses } = CoursesActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      avatar: currentCourse?.courseLogo || "",
      coursename: currentCourse?.courseName || "",
      courseshortname: currentCourse?.courseShortName || "",
      category: currentCourse?.courseCategoryID || "",
      courseurl: currentCourse?.courseUrl || "",
    }),
    [currentCourse]
  );

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
  }, [currentCourse, reset, defaultValues]);

  React.useEffect(() => {
    if (allCourses?.length && id) {
      const data = allCourses.find((course) => String(course?.id) === String(id));
      setCurrentCourse(data);
    }
  }, [allCourses, id]);

  const fieldMapping = {
    avatar: "courseLogo",
    coursename: "courseName",
    courseshortname: "courseShortName",
    category: "courseCategoryID",
    courseurl: "courseUrl",
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentCourse[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }
    changedFields.id = currentCourse.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);

        if (isEdit) {
          await dispatch(updateCourses(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.courses.list);
            } else {
              toast.error(res?.payload?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createCourses(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.courses.list);
            } else {
              toast.error(res?.payload?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentCourse.id, dispatch, router, fetchCourses, createCourses, updateCourses]
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
                          {allCategories?.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.courseCategoryName}
                            </MenuItem>
                          ))}
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
          <LoadingButton
            color="primary"
            loading={isSubmitting || isImageUploading}
            type="submit"
            variant="contained"
          >
            {isEdit ? 'Update' : 'Create'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
