import { FieldProps } from "formik";
import React from "react";
import CreatableSelect from 'react-select/creatable';


export default class MySelect extends React.Component {


  render() {

      const { field, options, form } = this.props;
      return (
          <CreatableSelect
            isMulti
            isClearable
            name = {field.name}
            options={options}
            value = {options? options.find(option => option.value ===field.value) : ''}
            onChange={(option) =>{
                if (option === null) {
                    return  form.setFieldValue(field.name,'')

                }
                 form.setFieldValue(field.name,option.value)
             }}
            onBlur={field.onBlur}
          />
      );
  }
}
