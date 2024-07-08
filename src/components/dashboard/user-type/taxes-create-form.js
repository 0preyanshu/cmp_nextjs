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
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { toast } from '@/components/core/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { UserTypeActions } from '@/redux/slices';
import PrivilegesForm from '@/components/core/privilegesAccordian';

const schema = zod.object({
  userTypeName: zod.string().min(1,'Use TypeName is required'),
  defaultPrivileges: zod.array(zod.string()).min(0, 'Please select at least one privilege')
});

export function TaxesCreateForm() {
  const [currentUserType, setcurrentUserType] = React.useState({});
  const { userTypes, loading: isLoading, totalElements } = useSelector((state) => state.userType.userType);
  const { id } = useParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const {  updateUserType ,createUserType} = UserTypeActions;

  const isEdit = pathname.includes('edit');

  const defaultValues = React.useMemo(() => ({
    userTypeName: currentUserType?.userTypeName || "",
    defaultPrivileges: currentUserType?.defaultPrivileges?.map(String) || []
  }), [currentUserType]);

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
  }, [currentUserType, reset, defaultValues]);

  React.useEffect(() => {
    if (userTypes?.length && id) {
      const data = userTypes.find((userTypes) => String(userTypes?.id) === String(id));
      setcurrentUserType(data);
    }
  }, [userTypes, id]);


  const getChangedFields = (data) => {
    const changedFields = {};
    for (const key in data) {
      if (String(data[key]) !== String(currentUserType[key])) {
        changedFields[key] = data[key];
      }
    }
    changedFields.id = currentUserType.id;
    return changedFields;
  };

  const onSubmit = React.useCallback(
    async (data) => {
      try {
        const changedData = getChangedFields(data);
        console.log(data, "data");
        console.log(changedData, "changed data");

        if (isEdit) {
          await dispatch( updateUserType(changedData)).then((res) => {
            if (res?.payload?.data?.data) {
              toast.success('Update success!');
              router.push(paths.dashboard.usertype.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        } else {
          await dispatch(createUserType(data)).then((res) => {
            console.log(res?.payload?.data, "restax")
            if (res?.payload?.data?.data) {
              toast.success('Create success!');
              router.push(paths.dashboard.usertype.list);
            } else {
              toast.error(res?.payload?.data?.error?.message || 'Internal Server Error');
            }
          });
        }
      } catch (err) {
        logger.error(err);
      }
    },
    [isEdit, currentUserType.id, dispatch, router, updateUserType, createUserType]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={4}>
            <Stack spacing={3}>
              <Grid container spacing={3}>
                <Grid xs={12} />
                <Grid md={12} xs={12}>
                  <Controller
                    control={control}
                    name="userTypeName"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.userTypeName)} fullWidth>
                        <InputLabel required>UserType Name</InputLabel>
                        <OutlinedInput {...field} />
                        {errors.userTypeName ? <FormHelperText>{errors.userTypeName.message}</FormHelperText> : null}
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
              </Grid>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button color="secondary" component={RouterLink} href={paths.dashboard.usertype.list}>
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
