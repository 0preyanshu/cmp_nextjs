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
import { timeZoneData } from '@/utils/timezoneData';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { Option } from '@/components/core/option';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { TimezoneAction } from '@/redux/slices';
import { useParams, usePathname } from 'next/navigation';
import { z } from 'zod';
import { MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const schema = z.object({
  timezoneName: z.string().nonempty('Timezone Name is required').max(255, 'Timezone Name must be at most 255 characters'),
  timezoneShortName: z.string().nonempty('ShortName is required').max(255, 'ShortName Name must be at most 255 characters'),
  gmtOffset: z.string().nonempty('GMT Offset is required'),
});

export function CustomerCreateForm() {
  const [currentTimezone, setcurrentTimezone] = React.useState({});

  const { allTimezones } = useSelector((state) => state?.timezone?.timezones);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const {  createTimezones, updateTimezones } = TimezoneAction;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      timezoneName: currentTimezone?.timezoneName || '',
      timezoneShortName: currentTimezone?.timezoneShortName || '',
      gmtOffset: currentTimezone?.gmtOffset || '',
    }),
    [currentTimezone]
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
  }, [currentTimezone, reset, defaultValues]);



  React.useEffect(() => {
    console.log('id', id);
    console.log('allTimezones', allTimezones);
    if (allTimezones?.length && id) {
      const data = allTimezones.find((allTimezones) => String(allTimezones?.id) === String(id));
      setcurrentTimezone(data);
      console.log('currentTimezone', data);
    }
  }, [allTimezones, id]);

  const fieldMapping = {
    timezoneName: 'timezoneName',
    timezoneShortName: 'timezoneShortName',
    gmtOffset: 'gmtOffset',
  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (String(data[key]) !== String(currentTimezone[mappedKey])) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentTimezone.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data, 'data');
        console.log(changedData, 'changed data');

        if (isEdit) {
          await dispatch(updateTimezones(changedData)).then((res) => {
            console.log(res?.payload, 'restax');
            toast.success('Update success!');
            if (res?.payload?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.timezones.list);
           
            } else {
              toast.error(res?.payload?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createTimezones(data)).then((res) => {
            console.log(res?.payload, 'restax');
            if (res?.payload?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.timezones.list);
            
            } else {
              toast.error(res?.payload?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentTimezone.id, dispatch, router, updateTimezones, createTimezones]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12}></Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="timezoneName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.timezoneName)} fullWidth>
                        <InputLabel required>Timezone Name</InputLabel>
                        <Select
                          {...field}
                          onChange={(e) => {
                            const selectedZone = timeZoneData.find(
                              (zone) => zone.timeZoneName === e.target.value
                            );
                            setValue('timezoneName', selectedZone.timeZoneName);
                            setValue('gmtOffset', selectedZone.gmtOffset);
                          }}
                        >
                          <MenuItem value="">
                            <>Select Timezone</>
                          </MenuItem>
                          {timeZoneData?.map((zone) => (
                            <MenuItem key={zone.timeZoneName} value={zone.timeZoneName}>
                              {zone.timeZoneName + '      ' + zone.gmtOffset}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.timezoneName ? (
                          <FormHelperText>{errors.timezoneName.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="timezoneShortName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.timezoneShortName)} fullWidth>
                        <InputLabel required>Timezone Short Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.timezoneShortName ? (
                          <FormHelperText>{errors.timezoneShortName.message}</FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.timezones.list}>
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
