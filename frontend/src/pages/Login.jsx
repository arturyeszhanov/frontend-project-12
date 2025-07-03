import React from 'react';
import { Formik, Form, Field } from 'formik';

const Login = () => (
  <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 className="text-3xl font-bold text-blue-600 mb-4">Вход</h2>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {() => (
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 font-medium text-gray-700">
              Имя пользователя
            </label>
            <Field
              id="username"
              name="username"
              type="text"
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-gray-700">
              Пароль
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              className="border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default Login;
