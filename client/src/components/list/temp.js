<CreatableSelect
  isMulti
  isClearable
  onChange={this.handleChange.bind(this)}
  onCreateOption={this.handleCreate.bind(this)}
  options={options}
  value={value}
/>

<div className="form-group">
  <label htmlFor="categories">Categories</label>
    <Field
      name = {'categories'}
      component={MySelect}
       className={'form-control' + (errors.categories && touched.categories ? ' is-invalid' : '')}
       options={ this.testOptions}
    />
    <ErrorMessage name="categories" component="div" className="invalid-feedback" />
  </div>
    handleChange(newValue, actionMeta){
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        this.setState({ value: this.state.value.push(newValue) });
    }

    handleCreate (inputValue) {
        console.log(inputValue);
    //    this.setState({ isLoading: true });
        console.group('Option created');
        console.log('Wait a moment...');

      const { options } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      this.setState({
        isLoading: false,
        options: [...options, newOption],
        value: newOption,
      });
  }
