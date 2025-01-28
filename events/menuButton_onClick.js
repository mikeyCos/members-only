const menuButton_onClick = (e) => {
  const menuButton = e;
  const navRightWrapper = document.querySelector(".nav-right-wrapper");
  menuButton.ariaPressed = menuButton.ariaPressed !== "true";
  navRightWrapper.classList.toggle("active");
};
