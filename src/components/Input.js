import React from 'react';

const Input = ({ label, validatorHint = '', ...props }) => {
  return (
    <div>
      <label className="fieldset-label">{label}</label>
      <input
        className={`input w-full validator`}
        {...props}
        // required
        // name="password"
        // type="password"
        // placeholder="Password"
      />
      <p className="validator-hint hidden">{validatorHint}</p>
    </div>
  );
};

export default Input;
