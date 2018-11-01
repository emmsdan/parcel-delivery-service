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
 * initialize all the necessary functions
 */
const init = () => {
  showAccessPage();
  mobileMenu();
  return;
}


init();