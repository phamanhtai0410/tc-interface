
export const checkRoles = (array) => {
    return array?.length >= 1 && array[0] !== 'users'
}