export const inArray = (array, id, value) => {
  const row = array.find(r => r.id === value);
  if (!row) {
    return 'item does not exist';
  }
  return (row);
};

export const generateID = (max) => { return Math.floor(Math.random() * max + 100); };

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
