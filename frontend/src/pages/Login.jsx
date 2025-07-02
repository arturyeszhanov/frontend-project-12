import React from 'react';
import { Formik, Form, Field } from 'formik';

const Login = () => (
  <div>
    <h2>Вход</h2>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values) => {
        console.log(values)
      }}
    >
      <Form>
        <div>
          <label htmlFor="username">Имя пользователя</label>
          <Field id="username" name="username" type="text" />
        </div>

        <div>
          <label htmlFor="password">Пароль</label>
          <Field id="password" name="password" type="password" />
        </div>

        <button type="submit">Войти</button>
      </Form>
    </Formik>
  </div>
);

export default Login;
