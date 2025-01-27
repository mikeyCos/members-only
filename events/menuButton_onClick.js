const menuButton_onClick = (e) => {
  const menuButton = e;
  const navRightWrapper = document.querySelector(".nav-right-wrapper");
  console.log(navRightWrapper);
  console.log(menuButton);
  console.log(menuButton.ariaPressed);
  menuButton.ariaPressed = menuButton.ariaPressed !== "true";
  navRightWrapper.classList.toggle("active");
};
