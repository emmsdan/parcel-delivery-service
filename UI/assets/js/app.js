/**
 * select sign in/ sign up page
**/
const showAccessPage = () => {
  const addressbar  = window.location.href.split('.html?page=')[1] || 'none';
  if (addressbar.startsWith('sign')){
    let forms = document.querySelectorAll(`form`);
    for (let form of forms){
      if (form.id.toLowerCase() !== addressbar.toLowerCase()){
        form.classList.add('hide');
      }else{
        form.classList.remove ('hide');
      }
    }
  }
}

/**
 * show & close mobile navigation
 * Responsive mobile nav. bar
*/
const mobileMenu = () => {

    for (let menu of document.querySelectorAll(".show-nav")){
      menu.addEventListener('click', () => {
        const resp = document.querySelector('header nav');
        resp.classList.toggle ('responsive');
      })
    }
}

/**
 * include file directly into page
 */
const includeFile = (filename)  => {
  const dataAdd = document.querySelectorAll('[data-add-file]');
  for (let files of dataAdd){
    fetch (files.getAttribute('data-add-file'))
    .then ( (response) => {
      if (response.status === 200){

        return response.text();
      }
      throw Error ('file does not exist');
    })
    .then ( (response) => {
      files.removeAttribute('data-add-file');
        return files.innerHTML = response;
    })
    .catch ((error) => {
      files.setAttribute('data-error', error);
      console.log (error);
    })
  }
};

/**
 * allow modals
 */
const modal = () => {
  var button = document.querySelectorAll("[data-target]");
  for (let btn of button){
    btn.addEventListener('click', () => {
      const modal = document.querySelector(`#${btn.getAttribute('data-target')}`);
      modal.style.display = "flex";
      modal.querySelectorAll('.close').forEach((elem, ind) => {
        elem.addEventListener('click', () => {
          modal.style.display = "none";
        });
      })
      window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
      })
    })
  }
}

/**
 * initialize all the necessary functions
 */
const init = () => {
  showAccessPage();
  mobileMenu();
  modal();
  includeFile()
  return;
}


init();