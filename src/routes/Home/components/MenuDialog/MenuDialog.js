import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import { CREATE_MENU_FORM_NAME } from 'constants'
import { map } from 'lodash'
import classes from './MenuDialog.scss'
import Subheader from 'material-ui/Subheader'
import { List } from 'material-ui/List'
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export const MenuDialog = ({
    open,
    handleEdit,
    onChange,
    onRequestCloseMenu,
    submit,
    menu,
    formatDate,
    handleUpdateInput,
    handleNewRequest,
    dataSource,
    searchText
}) => (
        <Dialog
            title="Menu"
            open={open}
            onRequestCloseMenu={onRequestCloseMenu}
            contentClassName={classes.container}
            actions={[
                <FlatButton label="Cancel" secondary onTouchTap={onRequestCloseMenu} />,
                <FlatButton label="Submit" primary onTouchTap={submit} />
            ]}>
            <form >
                <Subheader> Week starting from :  {formatDate(menu.startDate)} till   {formatDate(menu.endDate)} </Subheader>
                <List className={classes.list}>
                {menu.dates && 
                    map(menu.dates, (date) => (
                    <div key={date}>
                        {date}  
                            {/* http://www.material-ui.com/v0.19.4/#/components/auto-complete //TODO: Needs to be a new child component*/}
                                <AutoComplete
                                    key={date}
                                    id={date}
                                    hintText="Type Product name"
                                    //searchText={searchText}
                                    //onUpdateInput={handleUpdateInput}
                                    //onNewRequest={handleNewRequest}
                                    dataSource={dataSource}
                                    filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                                    openOnFocus={true}
                                />
                    </div>    
                    
                ))}
                </List>
            </form>
        </Dialog>
    )

MenuDialog.propTypes = {
    open: PropTypes.bool,
    onSubmit: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    handleSubmit: PropTypes.func, // added by redux-form
    submit: PropTypes.func, // added by redux-form
}


export default reduxForm({
    form: CREATE_MENU_FORM_NAME
})(MenuDialog)
