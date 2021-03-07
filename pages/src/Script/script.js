console.log("Sass compiled");
//Hamburger Button for Mobile view
const HamburgerBtn = document.querySelector("#HamburgerBtn");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay");
const fadeElems = document.querySelectorAll(".has-fade");
const body = document.querySelector('body');

HamburgerBtn.addEventListener("click", function () {
	if (header.classList.contains("open")) {
		//close hamburger menu
		header.classList.remove("open");
        body.classList.remove('noscroll')
		fadeElems.forEach((element) => {
			element.classList.remove("fade-in");
			element.classList.add("fade-out");
		});
	} else {
		//open hamburger menu
		header.classList.add("open");
        body.classList.add('noscroll');
		fadeElems.forEach((element) => {
			element.classList.remove("fade-out");
			element.classList.add("fade-in");
		});
	}
});
