# Trumpet Technical Challenge

This is a simple project that allows users to create, delete, and edit textboxes on a page. The textbox contents are stored in-memory using a basic backend, allowing data to persist during the session.

## Running Project

1. Clone the repository to your local machine.

```bash
git clone <repository-url>
```
2. Navigate to the project directory and install dependencies:

```bash
npm install
# or
yarn install
```

3. Here you can run the unit tests with

```bash
npm run test
```

4. Or run the project locally:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the running project.

## File Structure
The project is built with:
- A frontend of React components that manage user interaction and state. Relevant files are:
    - `page.tsx`, `components/Header.tsx`, `components/Textbox.tsx`, `components/NewTextButton.tsx`
- A basic API route and backend that stores textboxes and content in-memory. The relevant file is `api/textboxes/route.ts`
- A comprehensive set of tests that cover components, API routes, and user workflows. The relevant files are `**.test.tsx`

## Tradeoffs and Additional Work

Provided I had more time for this project, the following are additional things I would work on in no particular order:

- The requirements here allowed for using in-memory storage for the back end. This preserves data between refreshes, however, not between server restarts. Adding a database would allow the data to persist even between server restart.
- Since everything is running locally, comprehensive error handling wasn't a priority or something I ended up adding. In a real world scenario with user data and network variability, I would add request validation, cleaner responses, and clearer user feedback.
    - Additionally, I would add relevant unittests to ensure that error handling behaves properly under controlled conditions.
- Although styling wasn't a requirement, adding font styling features would be nice.
- Adding the ability to reorder the textboxes would make the project more relevant and would correspond more to the expected behavior in the provided example on trumpet's platform.

Tradeoffs I made:

- Based on the requirements, it wasn't clear when a refresh would be initiated. Would the user click away from a textbox first and then refresh, or would they refresh while still typing?
    - I opted to save and store the contents of the textbox using a debounce strategy (when there's a change, start a timer and store data if there are no changes after 1 second). This way, if a user is typing in the textbox, doesn't click away, and refreshes, their data would likely still be saved.
    - This does make more requests than storing onBlur, but you gain in ensuring the most current data is stored. Further, we could have stored on every change in the textbox to save the most current data, however, this would make far too many requests, hurting performance.
- I used `Date.now()` as the identifier for the generated textboxes for simplicity. Technically collisions are possible if two textboxes were created at the millisecond, but it would be unlikely. Since everything is running locally, this approach is sufficient for this project. However, for robustness, it would be prudent to use something more unique because if this were operating in a distributed system, collisions could occur (date/time not the same on each machine).

