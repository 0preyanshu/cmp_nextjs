'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/components/core/toaster';


const schema = zod
  .object({
    email: zod.string().min(1, { message: 'Email is required' }).email(),
    password: zod.string().min(6, { message: 'Password should be at least 6 characters' }),
    confirmPassword: zod.string().min(6, { message: 'Confirm Password should be at least 6 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

const defaultValues = { email: '', password: '', confirmPassword: '' };

export function ResetPasswordForm({searchParams}) {
  const router = useRouter();
  


  const {email,utken} = searchParams;

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { ...defaultValues, email }, resolver: zodResolver(schema) });
  React.useEffect(() => {
    console.log("values",watch());
  }, [watch()])

  const onSubmit = React.useCallback(
    async (values) => {
      setIsPending(true);

      const { error, message } = await authClient.updatePassword({ email: values.email, utken, password: values.password });

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      if (message) {
        toast.success(message);
      }

      

      router.push(paths.auth.custom.signIn);
    },
    [checkSession, router, setError, utken]
  );

  return (
    <Stack spacing={4}>
      <div>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          
        </Box>
      </div>
      <Stack spacing={1}>
        <Typography variant="h5">Reset Password</Typography>
      </Stack>
      <Stack spacing={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} type="email" readOnly disabled />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput {...field} type="password" />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormControl error={Boolean(errors.confirmPassword)}>
                  <InputLabel>Confirm Password</InputLabel>
                  <OutlinedInput {...field} type="password" />
                  {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Button disabled={isPending} type="submit" variant="contained">
              Reset Password
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
