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

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { CourseCategoryActions } from '@/redux/slices';
import {InstructorActions} from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import { MenuItem, Select } from '@mui/material';
import { current } from '@reduxjs/toolkit';


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
  firstname: zod.string().min(1, 'First Name is required').max(255),
  lastname: zod.string().min(1, 'Last Name is required').max(255),
  email: zod.string().email('Invalid email').min(1, 'Email is required').max(255),

  
});



export function VendorsCreateForm() {
  const [currentInstructor, setcurrentInstructor] = React.useState({});

  const { allInstructors} = useSelector((state) => state?.instructors?.instructors);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { fetchInstructor, createInstructor,updateinstructor } = InstructorActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    avatar: currentInstructor?.photo || 'samplephoto',
    firstname: currentInstructor?.firstname || '',
    lastname: currentInstructor?.lastname || '',
    email: currentInstructor?.email || '',

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
    console.log("allInstructors",allInstructors);
    console.log("id",id);
    if (allInstructors?.length && id) {
      const data = allInstructors.find((allInstructors) => String(allInstructors?.id) === String(id));
      setcurrentInstructor(data);
      console.log("currentInstructor",data);
    }
  }, [allInstructors, id]);

  const fieldMapping = {
    avatar : "photo",
    firstname:"firstname",
    lastname:"lastname",
    email:"email",

  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentInstructor[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentInstructor.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data);
        console.log(changedData);

        if (isEdit) {
          await dispatch(updateinstructor(changedData)).then((res) => {
            if (res?.payload?.data?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.vendors.list);
      
            } else {
              toast.error(res?.payload?.data?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createInstructor(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.vendors.list);

              console.log("allInstructors",allInstructors); 
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
       
      }
    },
    [isEdit, currentInstructor.id, dispatch, router,fetchInstructor,updateinstructor,createInstructor]
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

              <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="vendorname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.vendorname)} fullWidth>
                        <InputLabel required>Vendor Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.vendorname ? <FormHelperText>{errors.vendorname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
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
                        <InputLabel required>Phone Number</InputLabel>
                        <OutlinedInput {...field}  />
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
          <Button color="secondary" component={RouterLink} href={paths.dashboard.vendors.list}>
            Cancel
          </Button>
        <LoadingButton
          color="primary"
          loading={isSubmitting}
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
