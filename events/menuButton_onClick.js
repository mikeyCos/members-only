const menuButton_onClick = (e) => {
  const menuButton = e;
  const navRight = document.querySelector(".nav-right");
  console.log(navRight);
  console.log(menuButton);
  console.log(menuButton.ariaPressed);
  menuButton.ariaPressed = menuButton.ariaPressed !== "true";
  navRight.classList.toggle("active");
};
