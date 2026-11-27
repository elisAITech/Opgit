# Contributing to FolderLab

First-time contributors are welcome. You can contribute code, documentation, tests, accessibility improvements, or carefully written bug reports.

## Before changing code

Find an [issue](https://github.com/elisAITech/Opgit/issues) that matches your interests. Check whether it already has an active PR. For a larger feature, discuss the approach before starting. If you found a new bug, report steps to reproduce and what you expected.

## Typical pull-request workflow

1. Fork this repository, unless you have permission to create branches here.
2. Clone your fork and create a branch such as \`fix/search-whitespace\`.
3. Run \`npm start\` and check the behavior at http://localhost:4173.
4. Make the smallest useful change and add tests where practical.
5. Run \`npm run check\` and \`npm test\`.
6. Commit, push to your fork, and open a **draft pull request** against this repository's \`main\`.
7. Describe the issue, changes, and test results. When ready, request review.
8. If a maintainer requests changes, push additional commits to the same branch.

Example:

~~~bash
git clone https://github.com/YOUR-USERNAME/Opgit.git
cd Opgit
git switch -c fix/search-whitespace
npm test
# Make changes and run checks
git add .
git commit -m "fix: trim search input"
git push -u origin fix/search-whitespace
~~~

Use your own GitHub username in place of \`YOUR-USERNAME\`.

## First-time contributor walkthrough

Use the closed [search-whitespace issue #1](https://github.com/elisAITech/Opgit/issues/1)
as a practice example. Its fix is already on `main`; investigate it without
implementing or submitting the fix again. For a real contribution, choose an
open issue that has no active pull request.

### 1. Set up a local copy

Install Git and Node.js 20 or later. No paid tools or additional npm packages
are needed. Check your installation in a terminal:

```bash
git --version
node --version
npm --version
```

On [the original repository](https://github.com/elisAITech/Opgit), select
**Fork** in GitHub to create a copy under your account. Replace `YOUR-USERNAME`
with your username in the commands below:

```bash
git clone https://github.com/YOUR-USERNAME/Opgit.git
cd Opgit
git remote add upstream https://github.com/elisAITech/Opgit.git
git remote -v
git fetch upstream
git switch -c practice/search-whitespace upstream/main
```

`origin` points to your fork, where you push changes. `upstream` points to the
original project, where maintainers review contributions. The last command
creates a separate practice branch from current upstream code. For a real
contribution, name your branch after the open issue.

### 2. Investigate and check the behavior

Start FolderLab with `npm start`. Open http://localhost:4173 in your browser.
Search for `Projects`, then ` Projects ` with spaces around the name. Read
issue #1 to understand why these queries originally behaved differently. On
current `main`, both should return the same result; a whitespace-only query
should behave like an empty search. Stop the server with Ctrl+C.

Find the relevant function and its regression tests using Git's built-in search:

```bash
git grep -n searchFolders -- src/model.js test/model.test.js
```

Open those files in an editor. On macOS/Linux, you can also read a file with
`cat src/model.js`; in Windows PowerShell, use `Get-Content src/model.js`.
Run the same checks on either platform:

```bash
npm run check
npm test
```

If a check fails, read its output before changing code. These commands check
syntax and run unit tests; they do not replace checking visible behavior in
the browser. Record the actual results when contributing.

### 3. Submit a real contribution

Stop here for the closed practice issue. For an open issue, make the focused
change and necessary tests, then run the checks again. Review the diff and
stage only the relevant files:

```bash
git status --short
git diff
```

After staging the relevant files, use `git diff --cached` to review what will
be committed. Commit with a descriptive message and push your branch with
`git push -u origin HEAD`.

On GitHub, open a pull request from your fork's branch to
`elisAITech/Opgit:main`. Choose **Create draft pull request** from the creation
menu. A draft PR lets you share work and get early feedback without presenting
unfinished changes as ready to merge. Link the open issue, explain the change,
and include the checks you ran and any limitations. When ready, select
**Ready for review** and request review from a maintainer if GitHub permits
it. Address feedback by pushing further commits to the same branch, not by
opening another PR for the same change.

## Coding conventions

Keep folder operations in \`src/model.js\` and browser behavior in \`src/app.js\`. Prefer no new dependencies for small fixes. Use DOM \`textContent\` for user-provided names. Keep the app usable on mobile and with a keyboard.

Do not include unrelated changes, secrets, or personal data. Report security vulnerabilities privately as directed by [SECURITY.md](SECURITY.md).
