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
import { useDispatch, useSelector } from 'react-redux';
import { TaxActions } from '@/redux/slices';
import { useParams, usePathname } from 'next/navigation';



const schema = zod.object({
  taxname: zod.string().optional(),
  taxpercentage: zod.preprocess(
    (input) => Number(input),
    zod.number().min(0, 'Tax percentage must be at least 0').max(100, 'Tax percentage must be at most 100')
  ),

});

export function CustomerCreateForm() {
  const [currentTax, setcurrentTax] = React.useState({});

  const { allTaxes, iserror , loading: isLoading, totalData } = useSelector((state) => state?.taxes?.taxes);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { createTax, updateTax ,fetchTaxes } = TaxActions;


  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    taxname: currentTax?.taxName ||"",
    taxpercentage: currentTax?.taxPercentage ||"",

  }), [currentTax]);

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
  }, [currentTax, reset, defaultValues]);


  React.useEffect(() => {

    if (allTaxes?.length && id) {
      const data = allTaxes.find((allTaxes) => String(allTaxes?.id) === String(id));
      setcurrentTax(data);

    }
  }, [allTaxes, id]);

  const fieldMapping = {
   
    taxname: "taxName",
    taxpercentage: "taxPercentage",

  };

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      const mappedKey = fieldMapping[key];
      if (String(data[key]) !== String(currentTax[mappedKey])) {
        changedFields[mappedKey] = data[key];
      }
    }
    // Add the id to the changed fields
    changedFields.id = currentTax.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data,"data");
        console.log(changedData,"changed data");

        if (isEdit) {
          await dispatch(updateTax(changedData)).then((res) => {
            
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.taxes.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createTax(data)).then((res) => {
            console.log(res?.payload?.data,"restax")
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.taxes.list);
   
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);

      }
    },
    [isEdit, currentTax.id, dispatch, router,fetchTaxes, updateTax, createTax]
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
                    name="taxname"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.taxname)} fullWidth>
                        <InputLabel required>Tax Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.taxname ? <FormHelperText>{errors.taxname.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
  <Controller
    control={control}
    name="taxpercentage"
    render={({ field }) => (
      <FormControl error={Boolean(errors.taxpercentage)} fullWidth>
        <InputLabel required>Tax Percentage</InputLabel>
        <OutlinedInput {...field}  />
        {errors.taxpercentage ? <FormHelperText>{errors.taxpercentage.message}</FormHelperText> : null}
      </FormControl>
    )}
  />
</Grid>

         
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.taxes.list}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
