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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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
import { VendorActions } from '@/redux/slices';
import { LoadingButton } from '@mui/lab';
import { MenuItem, Select } from '@mui/material';
import { current } from '@reduxjs/toolkit';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


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
  vendorname: zod.string().min(1,'Vendor Name is required'),
  firstname: zod.string().min(1,'First Name is required'),
  lastname: zod.string().min(1,'Last Name is required'),
  email: zod.string().email('Enter a valid email').min(1,'Email is required'),
  phone: zod.string().min(1,'Phone Number is required'),

  applicableForSystemEmail: zod.boolean(),
  emailToBeSend: zod.array(zod.string()).min(0, 'Email To Be Send is required'),
  'Welcome-Email': zod.boolean(),
  'Pre-requisite-Email': zod.boolean(),
  'Order-Email': zod.boolean(),
  'Transfer-Email': zod.boolean(),


});

export function VendorsCreateForm() {
  const [currentVendor, setcurrentVendor] = React.useState({});

  const { allVendors } = useSelector((state) => state?.vendors?.vendors);

  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const {fetchVendors,updatevendors,createvendor} = VendorActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(
    () => ({
      vendorname: currentVendor.vendorname || '',
      firstname: currentVendor.firstname || '',
      lastname: currentVendor.lastname || '',
      email: currentVendor.email || '',
      phone: currentVendor.phone || '',
      applicableForSystemEmail: currentVendor.applicableForSystemEmail || false,
      emailToBeSend: currentVendor.emailToBeSend || [],
      "Pre-requisite-Email": currentVendor?.emailTypes?.includes("Prerequisite Email") || false ,
      "Welcome-Email": currentVendor?.emailTypes?.includes("Welcome Email") || false ,
      "Order-Email": currentVendor?.emailTypes?.includes("Order Email") || false ,
      "Transfer-Email": currentVendor?.emailTypes?.includes("Transfer Email") || false ,
    }),
    [currentVendor]
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
  }, [currentVendor, reset, defaultValues]);

  React.useEffect(() => {
    console.log('allVendors', allVendors);
    console.log('id', id);
    if (allVendors?.length && id) {
      const data = allVendors.find((allVendors) => String(allVendors?.id) === String(id));
      setcurrentVendor(data);
    console.log("AA",data?.emailTypes?.includes("Order Email")) ;
    }
  }, [allVendors, id]);


  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      if (data[key] !== currentVendor[key]) {
        changedFields[key] = data[key];
      }
    }
    changedFields.id = currentVendor.id;
    delete changedFields['Pre-requisite-Email'];
    delete changedFields['Welcome-Email'];
    delete changedFields['Order-Email'];
    delete changedFields['Transfer-Email'];

    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        
        if(!data?.applicableForSystemEmail){
          data.emailToBeSend = [];
          data['Welcome-Email'] = false;
          data['Pre-requisite-Email'] = false;
          data['Order-Email'] = false;
          data['Transfer-Email'] = false;
        }
        
        if (data?.applicableForSystemEmail && data?.emailToBeSend?.length === 0) {
          toast.error('Select who should get emails!');
          return;
        }
        const emailTypes = [];
        
        if (data['Pre-requisite-Email']) {
          emailTypes.push("Prerequisite Email");
        }
        if (data['Welcome-Email']) {
          emailTypes.push("Welcome Email");
        }
        if (data['Order-Email']) {
          emailTypes.push("Order Email");
        }
        if (data['Transfer-Email']) {
          emailTypes.push("Transfer Email");
        }
        if (data?.applicableForSystemEmail && emailTypes?.length === 0) {
          toast.error('Select at least 1 email type!');
          return;
        }
        data.emailTypes = emailTypes;
        const changedData = getChangedFields(data);
        console.log(data);
        console.log(changedData);


        if (isEdit) {
          await dispatch(updatevendors(changedData)).then((res) => {
            console.log(res);
            if (res?.payload?.data?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.vendors.list);
            } else {
              toast.error(res?.payload?.data?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createvendor(data)).then((res) => {
            if (res?.payload?.data?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.vendors.list);

              console.log('allVendors', allVendors);
            } else {
              toast.error(res?.payload?.data?.data?.error?.message  || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentVendor.id, dispatch, router, fetchVendors,updatevendors,createvendor] 
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
                        <OutlinedInput {...field} type="email" />
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
                        <OutlinedInput {...field} />
                        {errors.phone ? <FormHelperText>{errors.phone.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  
                </Grid>
                <Grid md={6} xs={12} sx={{mt:2,mb:1}}>
  <FormControl fullWidth>
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <Typography variant="body1" sx={{mr:2,ml:1}}><b>Recieve System Emails</b></Typography>
      </Grid>
      <Grid item>
        <Controller
          control={control}
          name="applicableForSystemEmail"
          render={({ field }) => (
            <>
              <Switch {...field} checked={field.value} />
              {errors.applicableForSystemEmail ? <FormHelperText>{errors.applicableForSystemEmail.message}</FormHelperText> : null}
            </>
          )}
        />
      </Grid>
    </Grid>
  </FormControl>
</Grid>
<Grid md={6} xs={12}>
                  
                  </Grid>
                  {watch('applicableForSystemEmail') && <>
                    <Grid md={12} xs={12} sx={{mb:2}}>
                    <EmailToBeSend control={control} errors={errors} />

                    
                  
                  </Grid>

        <Grid item md={2} xs={6}>
          <FormControl error={!!errors["Welcome-Email"]}>
            <Controller
              name="Welcome-Email"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Welcome Email"
                  checked={field.value}
                />
              )}
            />
            {errors["Welcome-Email"] && <FormHelperText>{errors["Welcome-Email"].message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item md={3} xs={6}>
          <FormControl error={!!errors["Pre-requisite-Email"]}>
            <Controller
              name="Pre-requisite-Email"
              control={control}
           
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Pre-requisite Email"
                  checked={field.value}
                />
              )}
            />
            {errors["Pre-requisite-Email"] && <FormHelperText>{errors["Pre-requisite-Email"].message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item md={2} xs={6}>
          <FormControl error={!!errors["Order-Email"]}>
            <Controller
              name="Order-Email"
              control={control}
        
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Order Email"
                  checked={field.value}
                />
              )}
            />
            {errors["Order-Email"] && <FormHelperText>{errors["Order-Email"].message}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item md={2} xs={6}>
          <FormControl error={!!errors["Transfer-Email"]}>
            <Controller
              name="Transfer-Email"
              control={control}

              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Transfer Email"
                  checked={field.value}
                />
              )}
            />
            {errors["Transfer-Email"] && <FormHelperText>{errors["Transfer-Email"].message}</FormHelperText>}
          </FormControl>
        </Grid>
  
     
                  </>}
                 
      

              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.vendors.list}>
            Cancel
          </Button>
          <LoadingButton color="primary" loading={isSubmitting} type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </LoadingButton>
        </CardActions>
      </Card>
    </form>
  );
}


const icon = <Checkbox />;
const checkedIcon = <Checkbox checked />;



function EmailToBeSend({ control, errors }) {

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;


  const allEvents = [
    { id: 'VENDOR', eventName: 'VENDOR' },
    { id: 'PARTICIPANT', eventName: 'PARTICIPANT' }
  ];

  return (
    <div>
     <div>
      <Controller
        name="emailToBeSend"
        control={control}
        render={({ field }) => (
          <>
            <Autocomplete
              {...field}
              multiple
              disableCloseOnSelect
              freeSolo
              onChange={(event, newValue) => {
                if (newValue.find((option) => option.all))
                  return field.onChange(field?.value?.length === allEvents?.length ? [] : allEvents?.map((option) => option.id));

                field.onChange(newValue);
              }}
              options={allEvents && allEvents?.map((option) => option.id)}
              getOptionLabel={(eventId) =>
                allEvents.find((event) => event.id === eventId)?.eventName || ''
              }
              filterOptions={(options, params) => {
                const filter = createFilterOptions();
                const filtered = filter(options, params);
                return [{ title: 'Select All...', all: true }, ...filtered];
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={option.all ? (field.value.length === allEvents.length) : selected}
                  />
                  {option.all ? option?.title : allEvents.find((event) => event.id === option)?.eventName || ''}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  label="Select Applicable Events:"
                  {...params}
                  error={!!errors.emailToBeSend}
                  helperText={errors.emailToBeSend ? errors.emailToBeSend.message : ''}
                />
              )}
            />
          </>
        )}
      />
    </div>
    </div>
  );
}