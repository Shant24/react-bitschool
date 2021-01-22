import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import styles from '../Register/register.module.scss';
import { uppercaseFirstLetter } from '../../../helpers/utils';
import * as globalErrors from '../../../helpers/errors';
import validateEmail from '../../../helpers/validateEmail';
import {
  resetContactSended,
  sendContactForm,
} from '../../../store/actions/authActions';

const Contact = ({ isContactSanded, sendContactForm, resetContactSended }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
  });

  const [fieldIsActive, setFieldIsActive] = useState({
    name: false,
    email: false,
    message: false,
  });

  useEffect(() => {
    if (isContactSanded && values.name) {
      setValues({
        name: '',
        email: '',
        message: '',
      });

      resetContactSended();
    }
  }, [isContactSanded, resetContactSended, values.name]);

  const handleChangeValue = ({ target: { name, value } }) => {
    name === 'name'
      ? setValues({ ...values, [name]: uppercaseFirstLetter(value) })
      : setValues({ ...values, [name]: value });

    setErrors({ ...errors, [name]: null });
  };

  const validateValues = () => {
    let { name, email, message } = values;

    name = name.trim();
    message = message.trim();

    let valid = true;

    let nameErrText = null;
    let emailErrText = null;
    let messageErrText = null;

    if (!name) {
      nameErrText = globalErrors.nameReqError;
      valid = false;
    }

    if (!email) {
      emailErrText = globalErrors.emailReqError;
      valid = false;
    } else if (!validateEmail(email)) {
      emailErrText = globalErrors.invalidEmail;
      valid = false;
    }

    if (!message) {
      messageErrText = globalErrors.messageReqError;
      valid = false;
    } else if (message.length < 10) {
      messageErrText = globalErrors.messageLengthError;
      valid = false;
    }

    setErrors({
      name: nameErrText,
      email: emailErrText,
      message: messageErrText,
    });

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateValues()) {
      return;
    }

    let { name, email, message } = values;

    name = name.trim();
    message = message.trim();

    const sendValues = {
      name,
      email,
      message,
    };

    sendContactForm(sendValues);
  };

  const handleChangeFocus = (e, bool) => {
    const { name, value } = e.target;
    !value && setFieldIsActive({ ...fieldIsActive, [name]: bool });
  };

  return (
    <div className={styles.container}>
      <Container className={styles.bootstrapContainer}>
        <Row className={styles.row}>
          <Col xs={12} sm={10} md={8} lg={6} className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <h1>Contact us</h1>

              <div className={styles.inputContainer}>
                <label
                  className={`${fieldIsActive['name'] && styles.active}`}
                  htmlFor="contactName"
                >
                  Name
                </label>
                <input
                  id="contactName"
                  className={errors.name && styles.invalid}
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChangeValue}
                  onFocus={(e) => handleChangeFocus(e, true)}
                  onBlur={(e) => handleChangeFocus(e, false)}
                />
                <small>{errors.name}</small>
              </div>

              <div className={styles.inputContainer}>
                <label
                  className={`${fieldIsActive['email'] && styles.active}`}
                  htmlFor="contactEmail"
                >
                  Email
                </label>
                <input
                  id="contactEmail"
                  className={errors.email && styles.invalid}
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChangeValue}
                  onFocus={(e) => handleChangeFocus(e, true)}
                  onBlur={(e) => handleChangeFocus(e, false)}
                />
                <small>{errors.email}</small>
              </div>

              <div className={styles.inputContainer}>
                <label
                  className={`${fieldIsActive['message'] && styles.active}`}
                  htmlFor="contactMessage"
                >
                  Message
                </label>
                <textarea
                  id="contactMessage"
                  className={errors.message && styles.invalid}
                  value={values.message}
                  rows={
                    values.message.length > 35
                      ? values.message.length > 70
                        ? '3'
                        : '2'
                      : '1'
                  }
                  name="message"
                  onChange={handleChangeValue}
                  onFocus={(e) => handleChangeFocus(e, true)}
                  onBlur={(e) => handleChangeFocus(e, false)}
                />
                <small>{errors.message}</small>
              </div>

              <div className={styles.submitContainer}>
                <Button variant="primary" type="submit">
                  Send
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isContactSanded: state.auth.isContactSanded,
});

const mapDispatchToProps = {
  sendContactForm,
  resetContactSended,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
