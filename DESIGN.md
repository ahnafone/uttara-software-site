# Design and copy conventions

- The website uses a dark background (`rgb(28, 29, 36)`) and Montserrat body text. Preserve the existing component styling when making focused UI changes.
- The header brand link is intentionally rendered exactly as `timesheet.` (lowercase, including its period). Preserve this exact label.
- Existing lowercase sentences and labels are intentional. Do not automatically capitalize or proofread them, and do not lowercase proper names or acronyms as a blanket rule.
- The header's other navigation labels retain their existing uppercase visual treatment; the `timesheet.` brand link is the scoped exception.
- The timesheet application is a separate same-origin app at `/timesheet/`. Use a normal `href` for full-document navigation rather than an Angular router link.
