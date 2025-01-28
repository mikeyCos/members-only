# Changelog
---
### 27 JAN 2025
- Changed `postForm.ejs` `action` value from `/` to `/post/create`.
- Defined `maxlength` attribute with the value `560` for `textarea` input.
- Created `comingSoon.ejs` partial.
- Created `comingSoon.css` and `posts.css` style sheets.
- Placeholder routes now include `comingSoon.ejs` partial.
- The button in the `header` element is hidden when the screen width is greater than or equal to 768px.
- The `.nav-right-wrapper` generic container becomes visible when the screen width is greater than or equal to 768px.
---
### 26 JAN 2025
- Rebuilt the `menuButton.ejs` partial with a `svg` element instead of multiple `span` elements.
- Stylized the `.nav-main` container and it's child elements.
- Created `fonts` subdirectory.
- Saved `Noto_Sans` and `Oswald` variable fonts; defined them as custom fonts in `root.css` style sheet.
- Saved four `undraw_*.svg` icons.
- Wrapped `.nav-right` unordered list with a generic container with classname `nav-right-wrapper`.
- The `menuButton_onClick.js` module not toggles `active` class on `.nav-right-wrapper`.
- Commit before creating `styles` branch.
---
### 24 JAN 2025
- Created `menuButton.ejs` partial.
- Relaunched and redeployed on `Fly.io`.
- Created `menuButton_onClick.js` module; toggles `.active` on the `.nav-right` unordered list.
- Created `menuButton.css` style sheet.
 ---
### 23 JAN 2025
- Permitted logged in users to view their own posts regardless of their roles.
- Non-logged in users will not be able to visit the path `/account/view-posts/:username`.
- Removed `indexRouter.use()` from the `indexRouter.js` module and created `setAllPosts` in the `indexController.js` module; `indexRouter.use()` will always run despite the path. The middleware performs the same task as it previous did in the `indexRouter.js` module.
- Created `events` subdirectory and `textarea_onInput.js` module.
- The submit button for creating a post will be disabled on default but enabled when the input's value length is greater than 0.
- The `posts` table now has an `id` column.
- Users with the role `admin` can will be able to see a delete button; clicking the button will delete the corresponding post.
---
### 22 JAN 2025
- All posts can be rendered to the homepage.
- Created `post.ejs` partial.
- Deleted `postsRouter.js` and `postsController.js` modules.
- Logged in users can now create posts on the root path, `/`.
- Created `hasRole` recursive function in `hasRole.js` module; accepts two array arguments and pops the `userRoles` array for comparison.
- Currently, the `hasRole` recursive function is called in the `post.ejs` partial; if a user has specific roles, then the user will see the author and timestamp of posts. 
---
### 21 JAN 2025
- The `keyExists` query function now accommodates whether or not the given key exists and if the account has activated the key's corresponding role.
- Created `insertPost`, `getAccountPosts`, and `getAllPosts` query functions in the `queries.js` module.
- Created `postForm.ejs` and `posts.ejs` partials.
- Created `populatePostsTable` asynchronous function in `initdb.js` module.
---
### 17 JAN 2025
- Grouped `account_id` and `role_id` columns in `user_roles` table as a unique pair; an account can be in multiple roles, but cannot be in the same role multiple instances.
- The values for the `activation_key` column are now a substring of `gen_random_uuid()::text` with the following format: `XXXX-XXXX-XXXX-XXXX`.
---
### 16 JAN 2025
- Created `populateRolesTable` asynchronous function in `initdb.js` module.
- Created `CREATE_ACTIVATION_KEYS_QUERY` string value; the query will create `activation_keys` table with a `role_id` (foreign key) column and a `activation_key` character column.
---
### 15 JAN 2025
- Two routers are used on the the base URL `/account`.
- Changed mount path for `profileRouter` from `/username/:tab?` to `/view-profile/:username/:tab?`.
- Moved `isAuthenticated` middleware from `accountRouter.js` module to `myAccountRouter.js` module.
- Any requests on the base URL `/my-account` will check if the user is logged in by `req.isAuthenticated()`; if `req.isAuthenticated` returns false, set the HTTP status to `401` and render `401.ejs` page. 
- Created `postsRouter.js` and `postsController.js` modules.
- Created`activateKey.ejs` page and `activateKeyForm.ejs` partial.
---
### 14 JAN 2025
- Input errors for the login form will only show if `locals.errors.*` exists.
- Username and password inputs will now be re-entered to the form after invalid inputs.
- Deleted project locally and re-cloned repository after git error `fatal: bad object HEAD`.
---
### 13 JAN 2025
- Created `myAccountRouter.js`, and `myAccountController.js` modules.
- Created `accountPosts.ejs`, `activateAccount.ejs`, and `manageAccount.ejs` pages.
- "Profile not found" error message will render when a profile or account cannot be found in database.
- `Manage` and `Activate` anchors on a profile for the user who is currently logged in.
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
- Created and linked a `reset` style sheet.
---