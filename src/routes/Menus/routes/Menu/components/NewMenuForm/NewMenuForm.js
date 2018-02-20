import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { CREATE_MENU_FORM_NAME } from 'constants'
import { map } from 'lodash'
import classes from './NewMenuForm.scss'
import Subheader from 'material-ui/Subheader'
import { List } from 'material-ui/List'
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export const NewMenuForm = ({
    
    submit,
    menu,
    formatDate,
    dataSource,
    dataSourceConfig,
    searchText,
    handleAddDailyMenu,
    handleRemoveDailyMenu,
    handleDailyMenuQtyChange,
    handleDailyMenuNameChange,
    dailyMenu,
    saveMenu,
    onUpdateInput
    

}) => (
       
            <form onSubmit={saveMenu} className={classes.inputs}>
                
                <List className={classes.list}>
                    
                    {dailyMenu.map((dailyMenu, idx) => (
                        <div className="dailyMenu" key={idx}>
                            <AutoComplete
                                hintText={`Type product #${idx + 1} name`}
                                dataSource={dataSource}
                                dataSourceConfig={dataSourceConfig}
                                filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                                openOnFocus={true}
                                onNewRequest={handleDailyMenuNameChange(idx)}
                                onUpdateInput={onUpdateInput}
                                //value={dailyMenu.name}
                            />
                            
                            <TextField
                                hintText={`Type product #${idx + 1} quantity`}
                                value={dailyMenu.quantity}
                                onChange={handleDailyMenuQtyChange(idx)}
                            />
                        <button type="button" onClick={handleRemoveDailyMenu(idx, searchText)} className="small">-</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddDailyMenu} className="small">Add</button>
                </List>
           
           
            <button type="button" onClick={submit} className="small">Save Menu</button>
                </form>
          
    )

NewMenuForm.propTypes = {
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
}


export default reduxForm({
    form: CREATE_MENU_FORM_NAME
})(NewMenuForm)
