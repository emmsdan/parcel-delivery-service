window.addEventListener ('load', () => {
  const apiHost = 'emmsdan:5000/api/v1/'
  fetch (`${apiHost}parcels`)
  .then ((response) => {
    return response.json();
  })
  .then ( (response) => {
    const table = document.querySelector ('table');
    const tr = document.createElement ('tr');

    for (let data of response) {
      tr.innerHTML += `    <td>${data.content}</td>
      <td>${data.weight} kg</td>
      <td>${data.status}</td>
      <td><a href="#./parcel.html" data-target="changeDelivery">View</a></td>
  `;
    }
  })
})