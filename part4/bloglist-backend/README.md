# Exercises for part4

# File structure

```
tests/
  rest/                 .rest files for testing in VS code
    create_user_01.rest addition of a user
    create_blog_01.rest normal addition of a blog post (missing auth)
    delete_blog_01.rest normal addition of a blog post (missing auth)
    login_01.rest       normal login
```

Remember to use _"Authorization: Bearer ..."_ header when trying to create or delete blog posts.

# Running tests

When running tests **don't** run all tests concurrently with `npm test`, instead run tests sequentially with `npm test -- --test-concurrency=1` (here "1" means running only 1 process in parallel) – or use one from

1. `npm test -- tests/list_helper.test.js`, 
2. `npm test -- tests/blogs_api.test.js`, 
3. `npm test -- tests/login_api.test.js`, or
4. `npm test -- tests/users_api.test.js`.