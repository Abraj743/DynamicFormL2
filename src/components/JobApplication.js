
import React, { useState, useEffect } from 'react';

// Custom hook for form management
const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setValues({
        ...values,
        additionalSkills: {
          ...values.additionalSkills,
          [name]: checked,
        },
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // No errors, handle form submission
      return true;
    }
    return false;
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

// Validation function
const validate = values => {
  const errors = {};

  if (!values.fullName) {
    errors.fullName = 'Full Name is required';
  }

  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  if (!values.phoneNumber) {
    errors.phoneNumber = 'Phone Number is required';
  } else if (isNaN(values.phoneNumber)) {
    errors.phoneNumber = 'Phone Number must be a valid number';
  }

  if (['Developer', 'Designer'].includes(values.position)) {
    if (!values.relevantExperience) {
      errors.relevantExperience = 'Relevant Experience is required';
    } else if (isNaN(values.relevantExperience) || values.relevantExperience <= 0) {
      errors.relevantExperience = 'Relevant Experience must be a number greater than 0';
    }
  }

  if (values.position === 'Designer' && !values.portfolioURL) {
    errors.portfolioURL = 'Portfolio URL is required';
  } else if (values.position === 'Designer' && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(values.portfolioURL)) {
    errors.portfolioURL = 'Portfolio URL is invalid';
  }

  if (values.position === 'Manager' && !values.managementExperience) {
    errors.managementExperience = 'Management Experience is required';
  }

  if (!Object.values(values.additionalSkills).includes(true)) {
    errors.additionalSkills = 'At least one skill must be selected';
  }

  if (!values.interviewTime) {
    errors.interviewTime = 'Preferred Interview Time is required';
  }

  return errors;
};

// Job Application Form Component
const JobApplicationForm = () => {
  const initialValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
    position: 'Developer',
    relevantExperience: '',
    portfolioURL: '',
    managementExperience: '',
    additionalSkills: {
      javascript: false,
      css: false,
      python: false,
    },
    interviewTime: '',
  };

  const { values, errors, handleChange, handleSubmit } = useForm(initialValues, validate);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (submittedData) {
      setIsPopupOpen(true);
    }
  }, [submittedData]);

  const onSubmit = (e) => {
    const formIsValid = handleSubmit(e);
    if (formIsValid) {
      setSubmittedData(values);
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className='eventContainer'>
      <h2 className='head'>Job Application Form</h2>
      <form onSubmit={onSubmit} className='form-section'>
        <div className='form-field'>
          <label>
            Full Name:
          </label>
          <input type="text" name="fullName" value={values.fullName} onChange={handleChange} />
          {errors.fullName && <p className='error_msg'>{errors.fullName}</p>}
        </div>
        <div className='form-field'>
          <label>
            Email:
          </label>
          <input type="email" name="email" value={values.email} onChange={handleChange} />
          {errors.email && <p className='error_msg'>{errors.email}</p>}
        </div>
        <div className='form-field'>
          <label>
            Phone Number:
          </label>
          <input type="text" name="phoneNumber" value={values.phoneNumber} onChange={handleChange} />
          {errors.phoneNumber && <p className='error_msg'>{errors.phoneNumber}</p>}
        </div>
        <div className='form-field'>
          <label>
            Applying for Position:
            <select name="position" value={values.position} onChange={handleChange}>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
            </select>
          </label>
        </div>
        {['Developer', 'Designer'].includes(values.position) && (
          <div className='form-field'>
            <label>
              Relevant Experience (Years):
            </label>
            <input type="number" name="relevantExperience" value={values.relevantExperience} onChange={handleChange} />
            {errors.relevantExperience && <p className='error_msg'>{errors.relevantExperience}</p>}
          </div>
        )}
        {values.position === 'Designer' && (
          <div className='form-field'>
            <label>
              Portfolio URL:
            </label>
            <input type="text" name="portfolioURL" value={values.portfolioURL} onChange={handleChange} />
            {errors.portfolioURL && <p className='error_msg'>{errors.portfolioURL}</p>}
          </div>
        )}
        {values.position === 'Manager' && (
          <div className='form-field'>
            <label>
              Management Experience:
            </label>
            <textarea name="managementExperience" value={values.managementExperience} onChange={handleChange} />
            {errors.managementExperience && <p className='error_msg'>{errors.managementExperience}</p>}
          </div>
        )}
        <div className='form-field'>
          <label>
            Additional Skills:
            <div>
              <label>
                <input
                  type="checkbox"
                  name="javascript"
                  checked={values.additionalSkills.javascript}
                  onChange={handleChange}
                />
                JavaScript
              </label>
              <label>
                <input
                  type="checkbox"
                  name="css"
                  checked={values.additionalSkills.css}
                  onChange={handleChange}
                />
                CSS
              </label>
              <label>
                <input
                  type="checkbox"
                  name="python"
                  checked={values.additionalSkills.python}
                  onChange={handleChange}
                />
                Python
              </label>
            </div>
            {errors.additionalSkills && <p className='error_msg'>{errors.additionalSkills}</p>}
          </label>
        </div>
        <div className='form-field'>
          <label>
            Preferred Interview Time:
          </label>
          <input type="datetime-local" name="interviewTime" value={values.interviewTime} onChange={handleChange} />
          {errors.interviewTime && <p className='error_msg'>{errors.interviewTime}</p>}
        </div>
        <div className='form-field'>
          <button type="submit" className='submit-btn'>Submit</button>
        </div>
      </form>
      {isPopupOpen && (
        <div style={popupStyles}>
          <div style={popupContentStyles}>
            <h2 className='head' style={{color:"green"}}>Submission Complete</h2>
            <ul className='popup_list'>
              <li className="data">Name: {submittedData.fullNamename}</li>
              <li className="data">Email: {submittedData.email}</li>
              <li className="data">Phone: {submittedData.phoneNumber}</li>
              <li className="data">Position: {submittedData.position}</li>
              <li className="data">Time: {submittedData.interviewTime}</li>
              {submittedData.attendingWithGuest === "yes" && <li className="data">Guest: {submittedData.guestName}</li>}
            </ul>
            <button className='closePopUp' onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Popup styles
const popupStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  width: '300px',
  textAlign: 'center',
};

export default JobApplicationForm;
