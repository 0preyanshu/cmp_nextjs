'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

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
import Grid from '@mui/material/Unstable_Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions } from '@/redux/slices';
import PrivilegesForm from '@/components/core/privilegesAccordian';
import { Typography } from '@mui/material';

const getSchema = (isEdit) => zod.object({
  firstname: zod.string().min(1, 'First Name is required'),
  lastname: zod.string().min(1, 'Last Name is required'),
  email: zod.string().email('Invalid email address'),
  userTypeID: zod.string().min(1, 'User Type is required'),
  defaultPrivileges: zod.array(zod.string()).min(1, 'Please select at least one privilege'),
  password: !isEdit ? zod.string().min(4, 'Password must be at least 4 characters long') : zod.string().min(0, '0'),
  'Welcome-Email': zod.boolean(),
  'Pre-requisite-Email': zod.boolean(),
  'Order-Email': zod.boolean(),
  'Transfer-Email': zod.boolean(),
});

export function StatesCreateForm() {
  const [currentUser, setcurrentUser] = React.useState({});
  const { userTypes } = useSelector((state) => state.userType.userType);
  const { allUsers, loading: isLoading, totalData } = useSelector((state) => state.users.users);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const { updateUser, createUser } = UserActions;

  const isEdit = pathname.includes('edit');

  const schema = React.useMemo(() => getSchema(isEdit), [isEdit]);

  const defaultValues = React.useMemo(() => ({
    firstname: currentUser?.firstname || "",
    lastname: currentUser?.lastname || "",
    email: currentUser?.email || "",
    userTypeID: currentUser?.userTypeID || "",
    defaultPrivileges: currentUser?.defaultPrivileges || [],
    password: "test123",
    'Welcome-Email': currentUser?.['Welcome-Email'] || false,
    'Pre-requisite-Email': currentUser?.['Pre-requisite-Email'] || false,
    'Order-Email': currentUser?.['Order-Email'] || false,
    'Transfer-Email': currentUser?.['Transfer-Email'] || false,
  }), [currentUser]);

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
  }, [currentUser, reset, defaultValues]);

  React.useEffect(() => {
    if (allUsers?.length && id) {
      const data = allUsers.find((allUsers) => String(allUsers?.id) === String(id));
      setcurrentUser(data);
    }
  }, [allUsers, id]);

  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      if (String(data[key]) !== String(currentUser[key])) {
        changedFields[key] = data[key];
      }
    }
    changedFields.id = currentUser.id;
    return changedFields;
  };

  const transformEmails = (data) => {
    const emails = [];
    if (data['Welcome-Email']) emails.push('WELCOME');
    if (data['Pre-requisite-Email']) emails.push('PRE_REQUISTE');
    if (data['Order-Email']) emails.push('ORDER');
    if (data['Transfer-Email']) emails.push('TRANSFER');
    return emails;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(changedData, "cd");

        const payload = {
          ...changedData,
          emailToBeSend: transformEmails(data),
        };

        if (isEdit) {
          await dispatch(updateUser(payload)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.users.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createUser(payload)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.users.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentUser.id, dispatch, router, updateUser, createUser]
  );

  const handleUserTypeChange = (event) => {
    const selectedUserType = userTypes.find((type) => type.id === event.target.value);
    setValue('userTypeID', selectedUserType.id);
    setValue('defaultPrivileges', selectedUserType.defaultPrivileges);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12} />
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
                        <OutlinedInput {...field} />
                        {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid md={6} xs={12}>
                  <Controller
                    control={control}
                    name="userTypeID"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.userTypeID)} fullWidth>
                        <InputLabel required>User Type</InputLabel>
                        <Select
                          {...field}
                          onChange={(event) => {
                            field.onChange(event);
                            handleUserTypeChange(event);
                          }}
                        >
                          <MenuItem key="" value="">
                            Select User Type
                          </MenuItem>
                          {userTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.userTypeName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.userTypeID ? <FormHelperText>{errors.userTypeID.message}</FormHelperText> : null}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="defaultPrivileges"
                    render={({ field }) => (
                      <PrivilegesForm
                        selectedPrivileges={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Grid>
                
                <Grid md={12} xs={12}>
                  <Typography variant="h6" mb={3}>Emails To Be Send</Typography>
                  <Controller
                    control={control}
                    name="Welcome-Email"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Welcome Email"
                      />
                    )}
                  />
                </Grid>
                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="Pre-requisite-Email"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Pre-requisite Email"
                      />
                    )}
                  />
                </Grid>
                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="Order-Email"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Order Email"
                      />
                    )}
                  />
                </Grid>
                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="Transfer-Email"
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Transfer Email"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.users.list}>
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
