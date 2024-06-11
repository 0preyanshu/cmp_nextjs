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

import { useDispatch, useSelector } from 'react-redux';
import { StateActions } from '@/redux/slices';
import { countryActions } from '@/redux/slices';

import { LoadingButton } from '@mui/lab';
import { MenuItem } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';





const schema = zod.object({
  
  stateName: zod.string().min(1, 'Name is required').max(255),
  stateShortName: zod.string().min(1, 'Short Name is required').max(255),
  countryID: zod.string().min(1, 'Country is required').max(255)



});

export function CustomerCreateForm() {
  const [currentState, setcurrentState] = React.useState({});
  const { allCountries } = useSelector((state) => state?.countries.country);
  const { allState, loading: isLoading, totalData } = useSelector((state) => state?.states?.state);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const {fetchCountries } = countryActions;

  const { deletestate, fetchState,updatestate,createstate } = StateActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    stateName : currentState?.stateName || '',
    stateShortName : currentState?.stateShortName || '',
    countryID : currentState?.countryID || ''
  }), [currentState]);

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
  }, [currentState, reset, defaultValues]);


  React.useEffect(() => {

    if (allState?.length && id) {
      const data = allState.find((allState) => String(allState?.id) === String(id));
      setcurrentState(data);
      console.log("currentState",data);
    }
  }, [allState, id]);

  const fieldMapping = {
    stateName: 'stateName',
    stateShortName: 'stateShortName',
    countryID: 'countryID'
  
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (data[key] !== currentState[mappedKey]) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentState.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data);
        console.log(changedData);

        if (isEdit) {
          await dispatch(updatestate(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.states.list);
        
            } else {
              toast.error(res?.payload?.data?.error?.message  || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createstate(data)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.states.list);
          
             
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
       
      }
    },
    [isEdit, currentState.id, dispatch, router, fetchState, updatestate,createstate]
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
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="stateName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.stateName)} fullWidth>
                        <InputLabel required>State Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.stateName ? <FormHelperText>{errors.stateName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="stateShortName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.stateShortName)} fullWidth>
                        <InputLabel required>State ShortName</InputLabel>
                        <OutlinedInput {...field} type="stateShortName" />
                        {errors.stateShortName ? <FormHelperText>{errors.stateShortName.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                <Controller
                    control={control}
                    name="countryID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.countryID)} fullWidth>
                        <InputLabel required>country</InputLabel>
                        <Select {...field}>
                          <MenuItem value="">
                            <>Select country</>
                          </MenuItem>
                          {
                           allCountries?.map((country) => (
                              <MenuItem key={country.id} value={country.id}>
                                {country.countryName}
                              </MenuItem>
                            ))
                          }
                        </Select>
                        {errors.countryID ? <FormHelperText>{errors.countryID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
           
              </Grid>
            </Stack>

    
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.states.list}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
            loading={isSubmitting}
          >
            {!isEdit ? 'Create Currency' : 'Save Changes'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}
