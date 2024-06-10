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
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
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
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import { all } from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { countryActions } from '@/redux/slices';
import { useParams, usePathname } from 'next/navigation';
import { LoadingButton } from '@mui/lab';



const schema = zod.object({

  countryname: zod.string().min(1, 'Name is required').max(255),
  countryshortname: zod.string().min(1, 'Short name is required').max(255),
 
});

export function CustomerCreateForm() {
  const [currentCountry, setcurrentCountry] = React.useState({});

  const { allCountries, loading: isLoading, totalData } = useSelector((state) => state?.countries?.country);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { createCountry, updateCountry ,fetchCountries } = countryActions;


  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    countryname: currentCountry?. countryName ||"",
    countryshortname: currentCountry?.countryShortName ||"",

  }), [currentCountry]);

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
  }, [currentCountry, reset, defaultValues]);

  React.useEffect(() => {
    const data = { page: "", limit: "25" };
    dispatch(fetchCountries(data));

  }, [dispatch]);

  React.useEffect(() => {

    console.log("id",id);
    console.log("allCountries",allCountries);
    if (allCountries?.length && id) {
      const data = allCountries.find((allCountries) => String(allCountries?.id) === String(id));
      setcurrentCountry(data);
      console.log("currentCountry",data);
    }
  }, [allCountries, id]);

  const fieldMapping = {
   
    countryname: "countryName",
    countryshortname: "countryShortName",

  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentCountry[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentCountry.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data);
        console.log(changedData);

        if (isEdit) {
          await dispatch(updateCountry(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.countries.list);
              dispatch(fetchCountries({ page: "", limit: "25" }));
            } else {
              toast.error(res?.payload?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createCountry(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.countries.list);
              dispatch(fetchCountries({ page: "", limit: "25" }));
   
            } else {
              toast.error(res?.payload?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);

      }
    },
    [isEdit, currentCountry.id, dispatch, router,fetchCountries, updateCountry, createCountry]
  );



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
            
              <Grid container spacing={3}>
              <Grid xs={12}>
               
               </Grid>
                {/* <Grid xs={12}>
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
                </Grid> */}
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="countryname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.name)} fullWidth>
                        <InputLabel required>Country Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.countryname ? <FormHelperText>{errors.countryname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="countryshortname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)} fullWidth>
                        <InputLabel required>Country ShortName</InputLabel>
                        <OutlinedInput {...field}  />
                        {errors.countryshortname ? <FormHelperText>{errors.countryshortname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
          
              </Grid>
            </Stack>

    
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.countries.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting}
          >
            {!isEdit ? 'Create Country' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
