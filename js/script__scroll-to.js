export function scrollTo(popup, scrollY) {
   let body = document.querySelector('body');

   if (popup.classList.contains('active')) {
      body.classList.add('lock');
      body.style.top = `-${scrollY}px`
   } else {
      body.classList.remove('lock');
      setTimeout(() => {
         body.style.top = `0px`;
         window.scrollTo(0, scrollY);
      }, 1);
   }
}