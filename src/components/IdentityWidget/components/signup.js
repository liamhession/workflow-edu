// Type stuff commented out throughout these files. Could be re-created with React PropTypes
import React from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import useLoading from '../useLoading';
import VisuallyHidden from '@reach/visually-hidden';

// type SignupProps = {
//   onSignup?: (user?: User) => void
// }

// Default, initial notification time and timezone to use for all new teachers, until they change it in UI
const DEFAULT_NOTIFICATION_TIME = '09:00';
const DEFAULT_TIMEZONE_NAME = 'America/New_York';

// We will not only create the signed-up user in Netlify Identity when person submits their signup details,
//    we will also create a new teacher document in Firestore so that we can add its id to the user_metadata
export function Signup({ onSignup }) { //: SignupProps) {
  const { signupUser } = useIdentityContext();
  const formRef = React.useRef/*<HTMLFormElement>*/(null);
  const [msg, setMsg] = React.useState('');
  const [isLoading, load] = useLoading();
  const signup = () => {
    if (!formRef.current) return;
    const full_name = formRef.current.username.value;
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    // Send details that make up a teacher to Firesotre
    const teacherInfo = {
      name: full_name,
      email,
      notificationTime: DEFAULT_NOTIFICATION_TIME,
      timezoneName: DEFAULT_TIMEZONE_NAME,
    };
    fetch('/.netlify/functions/create-new-teacher', {
      body: JSON.stringify(teacherInfo),
      method: 'POST',
    })

    // And then take the returned teacher ID to save in Netlify identity details
      .then((response) => response.json())
      .then((teacherObject) => {
        const { teacherId } = teacherObject;
        const data = { 
          signupSource: 'react-netlify-identity-widget',
          full_name,
          teacherId,
        };
        load(signupUser(email, password, data))
          .then((user) => {
            if (process.env.NODE_ENV !== 'production') console.log('Success! Signed up', user);
            if (onSignup) onSignup(user);
          })
          .catch((err) => void console.error(err) || setMsg('Error: ' + err.message));
      });
  };
  return (
    <form
      ref={formRef}
      className="form"
      onSubmit={(e/*: React.SyntheticEvent*/) => {
        e.preventDefault();
        signup();
      }}
    >
      <div className="RNIW_formGroup" key="username">
        <label>
          <VisuallyHidden>Enter your name</VisuallyHidden>
          <input
            id="username"
            className="RNIW_formControl"
            type="name"
            name="username"
            placeholder="Name"
            autoCapitalize="off"
            required={true}
          />
          <div className="RNIW_inputFieldIcon RNIW_inputFieldName" />
        </label>
      </div>
      <div className="RNIW_formGroup" key="email">
        <label>
          <VisuallyHidden>Enter your email</VisuallyHidden>
          <input
            className="RNIW_formControl"
            type="email"
            name="email"
            placeholder="Email"
            autoCapitalize="off"
            required={true}
          />
          <div className="RNIW_inputFieldIcon RNIW_inputFieldEmail" />
        </label>
      </div>
      <div className="RNIW_formGroup" key="password">
        <label>
          <VisuallyHidden>Enter your password</VisuallyHidden>
          <input className="RNIW_formControl" type="password" name="password" placeholder="Password" required={true} />
          <div className="RNIW_inputFieldIcon RNIW_inputFieldPassword" />
        </label>
      </div>
      <div>
        <button type="submit" className={isLoading ? 'RNIW_btn RNIW_saving' : 'RNIW_btn'}>
          Sign Up
        </button>
        {msg && <pre style={{ background: 'salmon', padding: 10 }}>{msg}</pre>}
      </div>
    </form>
  );
}
