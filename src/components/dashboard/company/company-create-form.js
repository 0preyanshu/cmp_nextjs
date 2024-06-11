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
import { useDispatch,useSelector } from 'react-redux';
import { CompanyActions } from '../../../redux/slices';

import { LoadingButton } from '@mui/lab';


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
  companyname: zod.string().min(1, 'Name is required').max(255),
  companyemail: zod.string().email('Must be a valid email').min(1, 'Email is required').max(255),
  companyphone: zod.string().min(1, 'Phone is required').max(15),
  companyadd: zod.string().min(1, 'Address is required').max(255),
  companywebsite: zod.string().min(1, 'Website is required').max(255),
});

export function CompanyCreateForm({ currentCompany }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentCategory, setCurrentCategory] = React.useState({});

  const { deletecompanies, fetchCompanies,updatecompanies } = CompanyActions;




  const defaultValues = React.useMemo(() => {
    return {
      avatar: currentCompany?.logoUrl || '',
      companyname: currentCompany?.companyName || '',
      companyemail: currentCompany?.companyEmail || '',
      companyphone: currentCompany?.companyPhoneNumber || '',
      companyadd: currentCompany?.companyAddress || '',
      companywebsite: currentCompany?.companyUrl || '',
    };
  }, [currentCompany]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
    reset,
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  // Reset form values when currentCompany changes
  React.useEffect(() => {
    reset(defaultValues);
  }, [currentCompany, reset, defaultValues]);

  const onSubmit = React.useCallback(
    async (data) => {
      try {

//         avatar
// : 
// ""
// companyadd
// : 
// "123 Updated St, Updated City, Country"
// companyemail
// : 
// "updated@example.com"
// companyname
// : 
// "Update2345"
// companyphone
// : 
// "456"
// companywebsite
// : 
// "https:/"

await dispatch(updatecompanies(data)).then((res) => {
  console.log(res,"reso");
  if (res?.payload?.data?.data) {
    console.log(data,"data");
        toast.success('Details updated');
        router.push(paths.dashboard.companies.list);
  } else {
    toast.error(res?.payload?.message || 'Internal Server Error');
  }
})
        
      } catch (err) {
        logger.error(err);
        
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
                        src={avatar || "https://s.yimg.com/fz/api/res/1.2/UNFEB7JcR670u5K5_GwShA--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MjQw/https://s.yimg.com/zb/imgv1/668bcde9-2e90-37fc-a539-84e96867c9bc/t_500x300"}
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
                    name="companyname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.companyname)} fullWidth>
                        <InputLabel required>Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.companyname ? <FormHelperText>{errors.companyname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="companyemail"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.companyemail)} fullWidth>
                        <InputLabel required>Email address</InputLabel>
                        <OutlinedInput {...field} type="email" />
                        {errors.companyemail ? <FormHelperText>{errors.companyemail.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="companyphone"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.companyphone)} fullWidth>
                        <InputLabel required>Phone number</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.companyphone ? <FormHelperText>{errors.companyphone.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="companyadd"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.companyadd)} fullWidth>
                        <InputLabel required>Company Address</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.companyadd ? <FormHelperText>{errors.companyadd.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="companywebsite"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.companywebsite)} fullWidth>
                        <InputLabel required>Company Website</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.companywebsite ? <FormHelperText>{errors.companywebsite.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
              <LoadingButton
                type="submit"
                variant="contained"
                style={{ textTransform: 'capitalize' }}
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
