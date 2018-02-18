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
    saveMenu,
    onRequestCloseMenu,
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
    dailyMenu

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
            <form onSubmit={saveMenu} className={classes.inputs}>
                <Subheader> Week starting from :  {formatDate(menu.startDate)} till   {formatDate(menu.endDate)} </Subheader>
                <List className={classes.list}>
                {/* {menu.dates && 
                    map(menu.dates, (date) => (
                    <div key={date}>
                        {date}    */}
                            {dailyMenu.map((dailyMenu, idx) => (
                                <div className="dailyMenu" key={idx}>
                                    <AutoComplete
                                        // key={idx}
                                        // id={idx}
                                        hintText={`Type product #${idx + 1} name`}
                                        dataSource={dataSource}
                                        dataSourceConfig={dataSourceConfig}
                                        filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                                        openOnFocus={true}
                                        onNewRequest={handleDailyMenuNameChange(idx)}
                                        value={dailyMenu.name}
                                    />
                            {/* <TextField
                                hintText={`Type product #${idx + 1} name`}
                                value={dailyMenu.name}
                                onChange={handleDailyMenuNameChange(idx)}
                                // key={idx}
                                // id={idx}
                            />     */}
                                    <TextField
                                        hintText={`Type product #${idx +1} quantity`}
                                        value={dailyMenu.quantity}
                                        onChange={handleDailyMenuQtyChange(idx)}
                                        // key={idx}
                                        // id={idx}
                                    />    
                                  
                                    <button type="button" onClick={handleRemoveDailyMenu(idx)} className="small">-</button>
                                   
                                </div>
                            ))}
                            <button type="button" onClick={handleAddDailyMenu} className="small">Add</button>
                        {/* </div>
                ))}  */}
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
