import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { CREATE_MENU_FORM_NAME } from 'constants'
import classes from './NewMenuForm.scss'
import AutoComplete from 'material-ui/AutoComplete'
import { TextField } from 'redux-form-material-ui'
import DatePicker from 'material-ui/DatePicker';

export const NewMenuForm = ({ menu, handleSubmit, submitting}) => (

    <form className={classes.container} onSubmit={handleSubmit}>
        <h4>Menu</h4>
        <DatePicker
            hintText="Start Date"
        />
        <DatePicker
            hintText="End Date"
        />

        <AutoComplete
            // key={date}
            // id={date}
            // hintText="Type Product name"
            // dataSource={dataSource}
            // filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
            // openOnFocus={true}
        />

        <Field
            name="quantity"
            component={TextField}
            floatingLabelText="Quantity"
        />
       
        <RaisedButton
            primary
            label="Save"
            type="submit"
            className={classes.submit}
        />
    </form>
)

NewMenuForm.propTypes = {
    menu: PropTypes.object,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool
}

export default reduxForm({
    form: CREATE_MENU_FORM_NAME
})(NewMenuForm)