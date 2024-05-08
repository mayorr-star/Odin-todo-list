# Odin-todo-list

## Table of contents

- [Overview](#overview)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### Links

- Live Site URL: https://mayorr-star.github.io/odin_restaurant_page/

## My process

### Built with

- Flexbox
- CSS Grid
- Wepback
- ES6 Modules

### What I learned

- How to store and retrive data in the web storage API.

```js
function saveToLocalStorage(key, item) {
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(key, stringifiedItem);
}
function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
```
## Author

- Twitter - [@His_mayorr](https://www.twitter.com/@His_mayorr)