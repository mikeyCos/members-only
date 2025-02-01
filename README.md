<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url] -->
<!-- [![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mikeyCos/members-only">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">ProjectName</h3>

  <p align="center">
    project_description
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://members-only-mikey-cos.fly.dev/">Live Preview</a>
    <!-- ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a> -->
    ·
    <a href="https://github.com/mikeyCos/members-only/blob/main/CHANGELOG.md">Changelog</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#questions">Questions</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Members Only Screen Shot][product-screenshot]](https://example.com)

Project: Members Only

Hello world,

What a project this turned out to be! Getting to incorporate basic authentication in a application for the first time has been exciting and refreshing. I was able to practice my SQL skills, experiment with middlewares, and practice schema validation. I am satisfied with the project's current state; it's functionality and design. Note, there will be placeholder/filler data for functionality purposes.

The project's main objectives revolve around CRUD (Create, Read, Update, and Delete), authentication, and permissions. In other words, users can create an account, sign in with their account credentials (username and password), create/delete text posts, assign user roles based on serial keys, permit certain routes to users, and permit certain roles to view specific elements.

However, I did not follow the project's specification regarding roles, I made things more complicated than it needed to be. So, I somewhat implemented a role-based access control (RBAC) system. Instead of defining an account's role in `accounts` table, there are two additional tables defined; `user_roles` and `roles`. In order to assign a user a specific roll based on a pass-code, I used PSQL's UUID function `gen_random_uuid()`, to create serial keys made up of 16 uppercase alphanumeric characters with a dash between sets of 4 characters; for example, `000X-00X0-1Y11-1Y11`. Now, whenever a user submits a valid serial key, the id based on the account and the role id based on the activation key will be inserted into the `user_roles` table. When a account is selected from the database, the account's roles are aggregated into an array of strings but if the account has no roles, null is returned.

An example for an `account` object with/without roles:
```js
// roles: null
account: {
  id: 3,
  fullname: 'Firstname Lastname',
  email: 'foo@gmail.com',
  username: 'foobar',
  password: '$2a$10$tyval82yLsn7z6feIP4qluM4L/IgWh7rvSQJIRdK2TFQavm4Gbl5G',
  roles: null
}

// roles: [...strings]
account: {
  id: 3,
  fullname: 'Firstname Lastname',
  email: 'foo@gmail.com',
  username: 'foobar',
  password: '$2a$10$tyval82yLsn7z6feIP4qluM4L/IgWh7rvSQJIRdK2TFQavm4Gbl5G',
  roles: [ 'member', 'admin' ]
}
```

Since I designed accounts can optionally have none, one or more roles, I needed a way to verify the current user's role(s). This is where my `hasRole` utility recursive function comes in handy. Essentially, `hasRole` checks if a user's role exists in a query roles array. In order to avoid using nested loops `hasRole` will call itself while `userRolesArr` gets smaller. I could change the second parameter, `rolesQueryArr` to be a query string instead of an array of strings because the function does not check if all the query roles exist in the user's roles. If that were the case the function's time complexity will be constant, O(1), instead of linear, O(n).

If allowing account multiple roles was not complicated enough, I wanted to implement a tab-like navigation within a page. The main navigation will remain with an additional navigation for a specific route. In this case, the `account/view-profile/:username/:tab?` path will have an additional `nav` element that will specifically control the navigation elements on the profile page with the path `account/view-profile/:username/:tab?`.

Moving on, a reoccurring type of question I found myself asking is "where or when does it make sense to call X, Y, or Z middleware functions?" For example, like in the project, [Inventory Application](https://github.com/mikeyCos/inventory-application), I wondered where does it make sense to validate request queries and/or parameters? On the controller or router? I wonder a similar instance for validating form data, should that be processed on the controller or router? Furthermore, is it the validator's responsibility to render or redirect based on the validation result?

In this project, form validation is happening in the controller, and then the next middleware runs to check if there are errors. If there are no errors, then the final middleware will usually redirect and sometimes rerender the page. A part of me wants to combine the validation middleware and the middleware that checks if there are any errors. I do not know if it is acceptable for validation middleware to rerender a page if there are errors or call the next middleware if there are no errors. Therefore, many of the validation middlewares and the subsequent middleware structurally look similar. I like to figure out a solution in a future project. Maybe I can pass a form of options to a middleware and validate based on those options, then I can reuse that middleware.

A problem I am hoping to resolve in the near future is rendering the correct time and date to the client from the backend. As far as I know, I will need the frontend to communicate to the backend and/or vice versa because the server and client could be in different places in the world. Currently, a post's timestamp will be a UTC value.

The next time I build an application that requires logging in, I like to render a log in or sign up component on the home page instead of defining them in a navigation element. However, this seems to make more sense if the entire application is locked behind authentication. Whereas some applications may allow a visitor to traverse certain routes without logging in, and restricting other routes for logged in users.

Despite feeling uncertain about the way I structured the project from beginning to end, I am happy how it turned out. I think the project satisfies the project specifications and more. Visiting users can sign up, log in, logged in users can create posts, logged in users can activate serial keys and assign themselves roles, users with the admin role can delete posts, and certain routes can only be viewed if a user is logged in. I am looking forward to the upcoming lessons and projects.

To failing forward, cheers!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![JavaScript][JavaScript.js]][JavaScript-url]
[![Node][NodeJS]][NodeJS-url]
[![Express][Express.js]][Express-url]
[![EJS][EJS]][EJS-url]
[![CSS3][CSS3]][CSS3-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is a list of things you need to use the software and how to install them.

- Node
  ```sh
  nvm install --lts
  ```
- npm
  ```sh
  npm install npm@latest -g
  ```
- PostgreSQL
  ```sh
  sudo apt install postgresql postgresql-contrib libpq-dev
  ```

### Installation

1. Clone repository
      1. Clone [members-only repository](https://github.com/mikeyCos/members-only) using HTTPS/SSH/GitHub CLI; [more on cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository).
      2. Navigate to cloned repository.
      3. Remove `.git` folder.
      4. Run `git init`.
      5. Run `git branch -M main`.
      6. Create a new repository on GitHub.
      7. Run `git remote add origin REPLACE_WITH_SSH_OR_HTTPS`.
      8. Run `git add . && git commit`.
2. Navigate to local repository and install NPM packages with `npm install`.
3. Create `.env` file in the root directory and define environment variables.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Use the main navigation element or address bar to traverse the application. Clicking the icon in the header will load the root path which is the home page. Click sign up and fill out all input fields to create an account; write down your username and password! Once you sign up, you are automatically logged in and taken to the home page. Clicking the `Log out` navigation item will log out the current user, and redirect the logged out user to the home page.

If a visiting user tries to log in with invalid credentials, both username and password inputs' values are emptied, and the error message `Invalid username or password` is displayed. If either username or password input is filled, submitting the form will reuse the filled input's value and display an error message for the empty input.

Logging in from the log in page will redirect the logged in user to their profile page on the path `/my-account`. An additional navigation element is displayed that will change the profile's subsection. For now, clicking on either `Overview`, `PlaceholderA` or `PlaceholderB` navigation items will change the profile's subsection. Clicking `Manage`, `Activate Key`, `View Posts` navigation items will render their respective pages; i.e., clicking `Manage` will use `manageAccount.ejs` view.

Logged in users can create a text post at the home page, but posts cannot be edited. Users with the `member` role can see the author and timestamp of the each post. Users with no roles can see the author and timestamp of their own posts. Only users with the `admin` role can delete posts. Roles can be assigned based on the serial key submitted on the `Activate Key` page. The serial keys corresponding to specific roles are only known by the application's creator, and the serial keys can change behind the scenes.

Currently, a 404 page will render when no path matches and display `Resource not found`. If profile does not exist for routes with `:username` request parameter, then a 404 page will render and display `Profile not found`. If a user tries to visit a role-locked route, like on the path `/account/view-posts/:username`, without `admin` or `member` roles, then a 403 page will render and display `You do not have permissions to view resource.`. If a user tries to visit an authenticated route, like on the path `/my-account/:username/manage`, then a 401 page will render and display a message to login.

The database can be reset by running `node db/initdb.js` in the terminal. Make sure to provide database connection information.

_For more examples, please refer to the [Demo](./demo/DEMO.md)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Create skeleton components.
- [x] Initialized a PostgreSQL database.
  - [x] Create a accounts table first name, last name, email, password, member.
  - [x] Create a messages table author, message, timestamp.
  - [x] Create a table containing serial keys made up of 16 alphanumeric characters.
- [x] Create forms.
  - [x] Sign up.
    - [x] Automatically log in as created user.
  - [x] Log in.
  - [x] Create post.
- [x] Logout functionality
- [x] Create additional navigation bar for the profile page.
  - [x] Define routes that will change the content for the profile page; `overview`
  - [x] Define routes that will render a different page; `manageAccount`, `activateKey`.
- [x] Check current user's role(s).
  - [x] The role `member` grants permission to see post's author and timestamp.
  - [x] The role `admin` grants permission to delete posts.
  - [ ] The role `admin` grants permission to an admin dashboard route.
- [x] Create a create post form.
  - [ ] Preserve newline upon POST request.
- [ ] Create/rename a route for a frequently asked questions (FAQ) or about page.
- [ ] Implement touch support for closing and opening main navigation. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/mikeyCos/members-only](https://github.com/mikeyCos/members-only)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Best README Template](https://github.com/othneildrew/Best-README-Template)
- [Fly.io](https://fly.io/)
- [Undraw.co](https://undraw.co/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- QUESTIONS -->

## Questions

1. Where does it make more sense to authenticate? In a router or controller?
2. How to prevent the `account/create` route when a user is logged in?
3. How to prevent the user from going back to a login page?
4. When does it make more sense to use one input for fullname instead of one input for first name and one input for last name?
5. When does it make more sent to sanitize? Before or after validating?
6. How to preserve newline in a `textarea` element upon submitting a form?

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
[JavaScript-url]: https://www.javascript.com/
[JavaScript.js]: https://img.shields.io/badge/javascript-20232A?style=for-the-badge&logo=javascript
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/en
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[EJS]: https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black
[EJS-url]: https://ejs.co/
[CSS3]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://www.w3.org/TR/2001/WD-css3-roadmap-20010523/
[product-screenshot]: ./demo/media/project_screenshot_01.png