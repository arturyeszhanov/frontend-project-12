import { useRef, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Formik, Field, Form as FormikForm } from 'formik'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FloatingLabel,
} from 'react-bootstrap'
import signUpImage from '../../assets/avatar_1-D7Cot-zE.jpg'
import { setCredentials } from '../../slices/authSlice'
import { useAuth } from '../../hooks'
import apiPaths from '../../apiPaths.js'

const SignUpPage = () => {
  const { logIn } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [signUpError, setSignUpError] = useState(null)
  const fieldRefs = {
    username: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  }

  useEffect(() => {
    fieldRefs.username.current?.focus()
  }, [])

  useEffect(() => {
    if (signUpError) {
      toast.error(signUpError)
    }
  }, [signUpError])

  const handleSubmit = async (
    { username, password },
    { resetForm },
  ) => {
    try {
      const response = await axios.post(apiPaths.signup(), {
        username,
        password,
      })
      resetForm()
      window.localStorage.setItem('userId', JSON.stringify(response.data))
      dispatch(setCredentials(response.data))
      setSignUpError(null)
      logIn(response.data)
      navigate('/')
    }
    catch (error) {
      setSignUpError(
        t(
          error.response?.status
            ? 'notification.alreadyExist'
            : 'notification.error',
        ),
      )
    }
  }

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('validation.required'))
      .min(3, t('validation.usernameMinMax'))
      .max(20, t('validation.usernameMinMax')),
    password: Yup.string()
      .required(t('validation.required'))
      .min(6, t('validation.passwordMinAlt')),
    confirmPassword: Yup.string()
      .required(t('validation.required'))
      .oneOf([Yup.ref('password'), null], t('validation.passwordMatch')),
  })

  const handleKeyDown = (event, submitForm, values, setFieldTouched) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const fieldOrder = Object.keys(fieldRefs)
      const emptyField = fieldOrder.find(
        field => values[field].trim() === '',
      )
      if (emptyField) {
        setFieldTouched(emptyField, true)
        fieldRefs[emptyField].current?.focus()
      }
      else {
        submitForm()
      }
    }
  }

  const placeholders = {
    username: 'validation.usernameMinMax',
    password: 'validation.passwordMin',
    confirmPassword: 'validation.passwordMatch',
  }

  const labels = {
    username: 'signUpPage.username',
    password: 'signUpPage.password',
    confirmPassword: 'signUpPage.confirmPassword',
  }

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={signUpImage}
                  className="rounded-circle h-50"
                  alt={t('signUpPage.registration')}
                />
              </div>
              <Formik
                onSubmit={handleSubmit}
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={SignupSchema}
              >
                {({
                  isSubmitting, submitForm, values, setFieldTouched,
                }) => (
                  <Form as={FormikForm} className="w-50">
                    <h1 className="text-center mb-4">
                      {t('signUpPage.title')}
                    </h1>
                    {signUpError && (
                      <div className="alert alert-danger">{signUpError}</div>
                    )}
                    {Object.keys(fieldRefs).map(fieldName => (
                      <FloatingLabel
                        key={fieldName}
                        controlId={fieldName}
                        label={t(labels[fieldName])}
                        className="mb-3"
                      >
                        <Field name={fieldName}>
                          {({ field, meta }) => (
                            <>
                              <Form.Control
                                name={field.name}
                                id={field.id}
                                value={field.value}
                                onChange={field.onChange}
                                type={fieldName === 'username' ? 'text' : 'password'}
                                placeholder={t(placeholders[fieldName])}
                                isInvalid={meta.touched && !!meta.error}
                                ref={fieldRefs[fieldName]}
                                onKeyDown={e => handleKeyDown(
                                  e,
                                  submitForm,
                                  values,
                                  setFieldTouched,
                                )}
                                autoComplete="off"
                              />
                              <Form.Control.Feedback type="invalid" tooltip>
                                {meta.touched && meta.error}
                              </Form.Control.Feedback>
                            </>
                          )}
                        </Field>
                      </FloatingLabel>
                    ))}
                    <button
                      type="submit"
                      className="w-100 btn btn-outline-primary"
                    >
                      {isSubmitting
                        ? t('signUpPage.sending')
                        : t('signUpPage.registration')}
                    </button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignUpPage
