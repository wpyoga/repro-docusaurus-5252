(Some minimal) reproduction for facebook/docusaurus#5252

- [test-docusaurus-2.0.0-beta.4](test-docusaurus-2.0.0-beta.4)

    This was installed using:

    ```console
    $ npx -y @docusaurus/init@2.0.0-beta.4 init test-docusaurus-2.0.0-beta.4 classic
    ```

    The `.gitignore` file was removed so that all the files can be committed to the repository.

    To reproduce:

    - on one terminal, execute `yarn start`

    - on another terminal, edit `title` inside `docusaurus.config.js` using `vim` and save, twice: on the first save the site will be rebuilt, on the second save the site won't be rebuilt

    This effect is not *always* reproducible with 2 saves. Sometimes it takes a few saves. Once the site is not rebuilt, it won't be rebuilt anymore until the development server is shut down and `yarn start` is executed again.

    This effect is only reproducible using `vim`. `nano` and VS Code won't work. This is due to `vim` using an "atomic save" instead of replacing the edited file directly: [paulmillr/chokidar#35](https://github.com/paulmillr/chokidar/issues/35)

    Also, any element inside `docusaurus.config.js` can be used (edited) for this demonstration. It can be the theme, it can be any other element, as long as it changes the configuration. Just simply `touch`-ing the file won't work.

- [test-docusaurus-2.0.0-beta.4-extraLogging](test-docusaurus-2.0.0-beta.4-extraLogging)

    This is a copy of `test-docusaurus-2.0.0-beta.4`:

    ```console
    $ cp -a test-docusaurus-2.0.0-beta.4 test-docusaurus-2.0.0-beta.4-extraLogging
    ```

    Then it was modified to print out more logs onto the terminal.

    To reproduce the problem, use `yarn start` and `vim` the same way as reproducing with `test-docusaurus-2.0.0-beta.4`. However, in this version, you can see what's going on: upon the first save, there is a `change` event for `docusaurus.config.js`

    We can see that most of the time, following the `change` event, there will be an `unlink` event. After the `unlink` event, changes to `docusaurus.config.js` are not watched anymore.

- [test-chokidar-3.5.2-extralogging](test-chokidar-3.5.2-extralogging)

    This contains the files from the default docusaurus initialization, but with the docusaurus libraries removed. It seems that the presence of the files help with reproducing the problem.

    To reproduce the problem, execute `node test1.js` in this directory. Then use `vim` to modify `docusaurus.config.js`. This script calls chokidar's `watch()` function with the parameter `atomic` set to 2000 (ms), and will quit once there is an `unlink` event.

    Sometimes, there will only be a `change` event. Just edit the file `docusaurus.config.js` again a few times, most of the time there will be an `unlink` event.

- [test-minimal](test-minimal)

    This is a minimal reproduction. Running `node test1.js` and then editing `docusaurus.config.js` will reproduce the problem most of the time.

    One other way to reproduce the problem is by running `node test1.js` in one terminal, and then `cp docusaurus.config.js docusaurus.config.js.bak && rm docusaurus.config.js && cp docusaurus.config.js.bak docusaurus.config.js` in another terminal. The whole `cp ... && rm ... && cp ...` command sequence simulates `vim` saving a file.

    Yet another way, is to run `node test_self.js`. This script watches the file `docusaurus.config.js` and then repeatedly executes the above command sequence. Usually we get this output:

        ```
        [ 'blog/*.md', 'docusaurus.config.js' ]
        2021-08-01T12:12:09.892Z change docusaurus.config.js
        2021-08-01T12:12:10.397Z unlink docusaurus.config.js
        ```

    But sometimes (maybe 10% of the time) we get something like this:

        ```
        [ 'blog/*.md', 'docusaurus.config.js' ]
        2021-08-01T12:12:12.982Z unlink docusaurus.config.js
        ```

    Which means that the `change` event never appeared at all. Also, sometimes (less than 5% of the time) we get something like this:

        ```
        [ 'blog/*.md', 'docusaurus.config.js' ]
        2021-08-01T12:15:39.524Z change docusaurus.config.js
        2021-08-01T12:15:40.521Z change docusaurus.config.js
        2021-08-01T12:15:42.024Z unlink docusaurus.config.js
        ```
