export const newDate = () => new Date().toString()
export const inArray = (array, id, value) => {
    let row = array.filter(( r ) => {
      return r.id == value
    });
    if (!row) {
      return 'item does not exist';
    }
    return (row)
}
