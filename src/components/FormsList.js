import React from 'react';

const FormsList = ({ forms = [] }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      {forms?.map((form, index) => (
        <div key={form.name + index} className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 bg-base-50 rounded-sm">
              <img src={form.sprites.front_default} alt={form.name} />
            </div>
          </div>
          <p className="capitalize font-bold">{form.name}</p>
        </div>
      ))}
    </div>
  );
};

export default FormsList;
