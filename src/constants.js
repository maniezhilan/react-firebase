export const LIST_PATH = '/'
export const DETAIL_PATH = ':menuid'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const MENU_PATH = '/menus'
export const NEW_MENU_PATH = '/newMenu'

export const ACCOUNT_FORM_NAME = 'account'
export const LOGIN_FORM_NAME = 'login'
export const SIGNUP_FORM_NAME = 'signup'
export const NEW_PROJECT_FORM_NAME = 'newProject'
export const RECOVER_CODE_FORM_NAME = 'recoverCode'
export const RECOVER_EMAIL_FORM_NAME = 'recoverEmail'
export const EDIT_PRODUCT_FORM_NAME = 'editProduct'
export const CREATE_MENU_FORM_NAME = 'createMenu'
export const ADD_TO_CART_FORM_NAME = 'addToCart'

export const formNames = {
  account: ACCOUNT_FORM_NAME,
  signup: SIGNUP_FORM_NAME,
  login: LOGIN_FORM_NAME,
  recoverCode: RECOVER_CODE_FORM_NAME,
  recoverEmail: RECOVER_EMAIL_FORM_NAME,
  EDIT_PRODUCT_FORM_NAME,
  newMenu:CREATE_MENU_FORM_NAME,
  addToCart: ADD_TO_CART_FORM_NAME
}

export const paths = {
  list: LIST_PATH,
  account: ACCOUNT_PATH,
  detail: DETAIL_PATH,
  login: LOGIN_PATH,
  signup: SIGNUP_PATH,
  menus: MENU_PATH,
  newMenu: NEW_MENU_PATH
}

export default { ...paths, ...formNames }
