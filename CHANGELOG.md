# Changelog
---
### 12 JAN 2025
- Created `profileRouter.js`, and `profileController.js` modules.
- Respectively renamed `authenticationRouter.js` and `authenticationController.js` modules to `accountRouter.js` and `accountController.js`.
- Created `profileTabs` subdirectory.
- Created `profileTabs.ejs`, `overview.ejs`, `placeholderA.ejs`, and `placeholderB.ejs` partials.
- Navigating to `/account/view-profile/:username` will render a profile page with a navigation bar for profile tabs. Clicking on a profile tab will render the profile page at the appropriate tab.
---
### 10 JAN 2025
- Changed module `createAccountForm.ejs` filename to `signupForm.ejs`.
- Changed module `createAccount.ejs` filename to `signup.ejs`.
- Changed module `accountValidator.js` filename to `signupValidator.js`.
- Changed `DBNAME` in `.env` to a new local database name.
- Created fullname, username, and email inputs in `signupForm.ejs` partial.
- Commit before running `fly launch`.
---
### 09 JAN 2025
- Initial commit for `members-only` project.
- Installed dependencies.
- Inserted `Introduction` and `Assignment` sections in `PROJECT_SPECIFICATIONS.md`.
- Created `.env` file locally.
- Added `validateLogin` onto `authenticationController.postLogin` to validate inputs are not empty.
- Created a placeholder middleware in `authenticationRouter.js` module named `isAuthenticated`; redirects to the root path if `req.isAuthenticated()` returns true, otherwise move to the next middleware.
---
### 08 JAN 2025
- Installed `bcryptjs` dependency.
- Input errors in `createAccountForm.ejs` partial now use the value of `locals.errors?.*.msg` instead of static content.
- A user can login and logout their account with their valid username and password.
- Changed logout HTTP request method from `GET` to `POST` by changing the logout anchor into a form element.
- Created `demo` subdirectory and `DEMO.md`.
- Moved `passport.authentication` from the `authenticationRouter.js` module to `authenticationController.js` module.
- Creating an account will automatically sign the account in.
---
### 07 JAN 2025
- On a `POST` request, an account can be created when the form is validated without errors and the account will be inserted into a database depending on the `DATABASE_URL` from the `environment.js` module.
- Created `loginValidator.js` module with the intent to validate inputs before authenticating and logging in an account.
- Created `form.css` style sheet and added CSS properties to hide and show input errors.
---
### 06 JAN 2025
- Updated outdated dependencies.
- Created `DATABASE_URL` property in `environment.js` module; the value is either `process.env.DATABASE_URL` or `postgresql://${process.env.DBUSER}:${process.env.DBPASSWORD}@localhost:5432/${process.env.DBNAME}`.
- Installed `express-session`, `passport`, `passport-local`, and `connect-pg-simple` dependencies.
- Created `authenticationRouter.js`, `supportRouter.js` , `authenticationController.js`, `supportController.js`, and `passport.js` modules.
- Created `createAccount.ejs`, `login.ejs`, and `support.ejs` pages.
- Created `createAccountForm.ejs` and `loginForm.ejs` partials.
- Created `config` subdirectory and moved `environment.js` module from `utils` subdirectory to `config` subdirectory.
---
### 26 AUG 2024
- Initialized `NodeJS`/`Express` boilerplate template named `node-express-template`.
- Created a variety of files including: `CHANGELOG.md`, `app.js`, and `PROJECT_SPECIFICATIONS`.
- Created a variety of subdirectories including: `paths`, `public`, `routes`, `utils`, and `views`.
- Template can be locally started with `npm run dev`.
- Defined static and non-static paths in `paths/paths.js`.
- Created and linked a `reset` stylesheet.
---