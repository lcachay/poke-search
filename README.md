# poke-search

## Introduction

In this project, I created a simple Pokemon search application that fetches and displays a list of Pokémon from a public API. The app features a login page, a search page with filtering functionality, and a details modal that shows additional information about a selected pokemon.

## Thought Process

### Analysing the API

I started by exploring the API to understand what data I could retrieve and how I could interact with it. The main endpoints I focused on were those related to fetching the list of Pokémon and their details, including the endpoints for moves and forms.

### Test cases

After reviewing the project requirements, I created a set of test cases separated by the different views of the app:

#### Login Page Tests

- Username and password fields should be empty on first load.
- Should display an error if the username or password are empty on submit.
- Should display an error if the username and password do not match "admin" on submit.
- Should store authentication state when correct credentials are entered.

#### Search Page Tests

- Should fetch and display pokemon's list on load.
- Should filter pokemons by name when typing in the search bar.
- Should show an empty state message if no pokemon match the search.

#### Details View Tests

- Should correctly fetch and display the selected pokemon’s details.

### Wireframe

After having a more clear idea on what the page should do, I started thinking on what it could look like. I created a wireframe to plan the layout and functionality of the application. I used [Figma](https://www.figma.com/proto/fwovNIF8WLpQlMZQNk5GLD/poke-search?node-id=1-6&p=f&t=8akNGQzfMHggbLHx-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A6&show-proto-sidebar=1) to design it.

![alt text](image.png)

### Choosing an architecture

I already knew I'd be using `React` and `Jest`, but everything else was still undecided.
For bundling, I used `Webpack` as I had experience with it and knew it would be a reliable choice for building the project. I added `Babel` for compiling JavaScript and a `style-loader` for adding styles. I added a `file-loader` in the beggining but later found out that with webpack 5 that's not necessary anymore, thanks to webpack asset modules.

To maintain code consistency, I integrated `Prettier` into the project. After that I started creating the tests, and realized I would need a jest setup for mocking many things from the DOM, so I modified the `jest.config.js` and `jest.setup.js` accordingly.

For routing, I used `react-router-dom` because I find it reliable and easy to use.
For the UI, I drew inspiration from the provided Behance design and decided to use `DaisyUI`, which is built on top of `TailwindCSS`. Its themes are colorful and playful, a good fit for a pokemon based app I believe. To run both Tailwind and Webpack concurrently, I added `concurrently` as a package to streamline development.

### Assets

I got the royalty-free illustrations in this project from https://pixabay.com.

The favicon I made myself in Figma, and to generate the necessary favicon files I used https://favicon.io.

![alt text](image-1.png)

### Challenges

A challenge in this project was managing pagination, which I decided to do with an infinite scroll. Initially, I considered using a JavaScript scroll listener to detect when the user reached the bottom of the page and load more pokemons, as I did something similar in another practice project before. However, as I thought about it, it sounded non-performant, constantly listening for scroll events could become inefficient.

So I looked for a more reactive approach and learned about [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver), which provides a more efficient way to detect when an element enters or exits the viewport. This was my first time using the IntersectionObserver API, and although there is room for improvement, I'm happy with the results and the opportunity to learn something new.

## Conclusion

Overall, this project uses of frontend technologies, api calls, responsive design, and performance optimizations, all while following Test-Driven Development (TDD).
