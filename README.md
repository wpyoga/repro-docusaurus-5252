(Some minimal) reproduction for facebook/docusaurus#5252

- [test-docusaurus-2.0.0-beta.4](test-docusaurus-2.0.0-beta.4)

    This was installed using:

    ```console
    $ npx -y @docusaurus/init@2.0.0-beta.4 init test-docusaurus-2.0.0-beta.4 classic
    ```

    The `.gitignore` file was removed so that all the files can be committed to the repository.

    To reproduce:

    - on one terminal, execute `yarn start`

    - on another terminal, edit `docusaurus.config.js` using `vim` and save, twice: on the first save the site will be rebuilt, on the second save the site won't be rebuilt

    This effect is not *always* reproducible. Sometimes it takes a few saves. Once the site is not rebuilt, it won't be rebuilt anymore until the development server is shut down and `yarn start` is executed again.

- [docusaurus-2.0.0-beta.4-extraLogging](docusaurus-2.0.0-beta.4-extraLogging)

    This is a copy of `test-docusaurus-2.0.0-beta.4`:

    ```console
    $ cp -a test-docusaurus-2.0.0-beta.4 test-docusaurus-2.0.0-beta.4-extraLogging
    ```

    Then it was modified to print out more logs onto the terminal.




