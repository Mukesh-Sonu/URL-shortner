import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from './ui/input';
import { BeatLoader } from 'react-spinners';
import { Button } from './ui/button';
import Error from './ui/error';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import useFetch from '@/hooks/use-fetch';
import { login } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/context';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { data, loading, error, fn: fnLogin } = useFetch(login, formData);
  const { fetchUser } =  UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
      fetchUser()
    }
  }, [data, error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setErrors([]);

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Invalid Email')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be atleast 6 characters')
          .required('Password is required'),
      });

      await schema.validate(formData, { abortEarly: false });

      await fnLogin();

    } catch (error) {
      const newErrors = {};

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
            value={formData.email}
          />
          {errors && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            value={formData.password}
          />
          {errors && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLogin}>
          {' '}
          {loading ? <BeatLoader color="#36d7b7" /> : 'Login'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
