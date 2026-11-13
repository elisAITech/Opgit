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

## Coding conventions

Keep folder operations in \`src/model.js\` and browser behavior in \`src/app.js\`. Prefer no new dependencies for small fixes. Use DOM \`textContent\` for user-provided names. Keep the app usable on mobile and with a keyboard.

Do not include unrelated changes, secrets, or personal data. Report security vulnerabilities privately as directed by [SECURITY.md](SECURITY.md).
