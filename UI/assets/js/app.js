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
 * initialize all the necessary functions
 */
const init = () => { 
  showAccessPage();
  return;
}


init();