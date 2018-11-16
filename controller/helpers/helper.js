export const newDate = () => new Date().toString()

export const inArray = (array, id, value) => {
    let row = array.find(( r ) => {
      return r.id == value
    });
    if (!row) {
      return 'item does not exist';
    }
    return (row)
}
export const generateID = (max) => {
  return Math.floor(Math.random() * max  + 100);
}