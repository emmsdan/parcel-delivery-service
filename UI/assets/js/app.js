/**
 * select sign in/ sign up page
**/
const showAccessPage = () => {
  const addressbar  = window.location.href.split('.html?page=')[1] || window.location.href.split('/')[1];
  if (addressbar.startsWith('sign')){
    let forms = document.querySelectorAll(`form`);
    for (let form of forms){
      if (form.id.toLowerCase() !== addressbar.toLowerCase()){
        form.classList.add('hide');
      }else{
        form.classList.remove ('hide');
      }
    }
  }else if(addressbar.startsWith('orderCreate')) {
    return calculateWeight ();
  }
}

/**
 * show & close mobile navigation
 * Responsive mobile nav. bar
*/
const mobileMenu = (m = null) => {
    if (m === null){
      for (let menu of document.querySelectorAll(".show-nav")){
        menu.addEventListener('click', () => {
          const resp = document.querySelector('header nav');
          resp.classList.toggle ('responsive');
        })
      }
      return;
    }
  m.addEventListener('click', () => {
    const resp = document.querySelector('header nav');
    resp.classList.toggle ('responsive');
  })
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
      mobileMenu()
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
 * toast bar for notification
 */

const toast = (message='null') => {
  let toastMessage;
  const toastBox =document.querySelector('.toast')
  if (toastMessage = document.querySelectorAll(`[data-toast]`)){
    for (let tMsg of toastMessage){
      tMsg.addEventListener('click', () => {
        return toast(tMsg.getAttribute('data-toast'));
      })
    }
  }
  const toast = (message) => {
    toastBox.innerHTML = message;
    toastBox.classList.toggle('show');
    setTimeout(() => {
      toastBox.classList.remove("show");
    }, 5000);
  }
  if (message !== 'null'){
    toast(message);
  }
}

/**
 * AppView: allow loading external page into it
 */
const appView = (e) => {
  const shell = document.querySelector('[data-view]');
  fetch (`${e.getAttribute('href').split('#!')[1]}.volt`)
  .then ( (response) => {
    if (response.status === 200) {
      return response.text().then ( (resp) => {
        shell.innerHTML = resp;
        toast ('Page Loaded')
      })
    }
    throw Error ('Page was not found');
  })
  .catch ((error) => {
    toast (`Could not Load Page because ${error}`)
  })
}


/**
  * allow collapsible content
*/
const collapsible = () => {
  for (let collapse of document.querySelectorAll(".collapsible")) {
    collapse.addEventListener("click", function() {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      console.log ('before', content.style.maxHeight)
      if (!content.style.maxHeight.endsWith('px')){
        for (let removeActive of document.querySelectorAll(".collapse-content")) {
          removeActive.style.maxHeight = null;
        }
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
      console.log ('after', content.style.maxHeight)
    });
  }
}

/**
 * uploadImage
 */
const showImage = (file) => {
  if (file.files && file.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.querySelector('#uploadImage').src = e.target.result;
      document.querySelector('.uploadImage').style = 'opacity: 1; border-radius: 0;'
    };
    reader.readAsDataURL(file.files[0]);
  }
}

/**
 * calculateWeight()
 */
const calculateWeight = () => {
  const weight  = document.querySelector ('.weight');
  const priceBar  = document.querySelector ('.price');
  weight.addEventListener ('keyup', () => {
    priceBar.innerHTML = (parseInt(weight.value) * 2000) || 0;
  })
}

/**
 * make textareaAutoResize
 */
const textareaAutoResize = () => {
  for (let textarea of document.querySelectorAll('textarea')){
    textarea.addEventListener ('keyup', () => {
      if (textarea.value.length > 150 || textarea.scrollHeight > 100 && textarea.scrollHeight < 500){
        textarea.style.height = textarea.scrollHeight+'px';
        return;
      }
      textarea.style.height = '50px';
    })
  }
}
   /**
 * initialize all the necessary functions
 */
const init = () => {
  mobileMenu();
  showAccessPage();
  modal();
  toast();
  includeFile()
  collapsible();
  calculateWeight();
  return;
}

init();