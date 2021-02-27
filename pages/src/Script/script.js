console.log('Sass compiled');
//Hamburger Button for Mobile view
const HamburgerBtn = document.querySelector('#HamburgerBtn'); 

HamburgerBtn.addEventListener('click', function () {
    
    if (HamburgerBtn.classList.contains('open')) {
        HamburgerBtn.classList.remove('open');
        console.log('Hamburger button has been clicked');
    } else {
        HamburgerBtn.classList.add('open');
        console.log('Hamburger button has been clicked');
    }
});