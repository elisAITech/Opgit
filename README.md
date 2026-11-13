# FolderLab

FolderLab is a small open-source folder organizer. It runs in your browser, lets you create and manage nested folders, and stores your workspace locally. It's intentionally simple so first-time contributors can work on meaningful issues.

This is the test application hosted in the **Opgit** repository. It is a real project, not a mock PR destination.

## Run it

You need Node.js 20 or later. There are **no external runtime or npm dependencies**.

~~~bash
npm start
~~~

Open http://localhost:4173. Select a folder, create children, rename or delete folders, and use the search field. Data is saved in this browser using localStorage.

Run checks:

~~~bash
npm run check
npm test
~~~

The local server listens on 127.0.0.1 by default. Set PORT to change the port.

## How to contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md). Find an [open issue](https://github.com/elisAITech/Opgit/issues), discuss the expected behavior, then submit a focused PR. First-time contributors are welcome.

This app intentionally has some unresolved improvements, represented by public issues. Please don't fix every outstanding issue in one PR; each one is an independent contribution opportunity.

## Files

- \`index.html\` / \`styles.css\` — interface
- \`src/model.js\` — folder behavior, testable without a browser
- \`src/app.js\` — browser interactions and storage
- \`server.js\` — local static server
- \`test/model.test.js\` — unit tests
- \`.github/workflows/ci.yml\` — GitHub Actions checks

## Privacy and limitations

The app models *folder names and relationships*, not real files on disk. It does not upload user data or sync across devices. Browser storage is not a backup; clearing site data can remove the workspace.

Licensed under the MIT License.
