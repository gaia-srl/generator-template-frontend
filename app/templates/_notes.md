# Problems


## API

There are several problems with auto-reloading the API server when changes are detected.

 1. The `serverreload` feature of `grunt-express` works great, but it clobbers any existing `watch` tasks, so our front end livereloads stop working.
 2. Attempting to bypass `serverreload` using `watch` to call `express-restart` doesn't work because of this issue: [https://github.com/blai/grunt-express/issues/30](https://github.com/blai/grunt-express/issues/30)
 3. Other solutions like `nodemon` also seem to clobber the `watch` tasks
 4. Loading in the endpoint files when a request is made works great, but it means we cannot use variables in routes - e.g. `/api/user/getProfile/:id`