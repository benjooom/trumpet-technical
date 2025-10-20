# Trumpet Technical Challenge
## Getting Started

First, clone the repository

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Tradeoffs and Additional Work

Provided I had more time for this project, the following are additional things I would work on in no particular order:

- The requirements here allowed for using in-memory storage for the back end. This preserves data between refreshes, however, not between server restarts. Adding a database would allow the data to persist even between server restart.
- Since everything is running locally, comprehensive error handling wasn't a priority or something I ended up adding. In a real world scenario with user data and network variability, I would add request validation, cleaner responses, and clearer user feedback.
- Although styling wasn't a requirement, adding font styling features would be nice.
- Adding the ability to reorder the textboxes would make the project more relevant and would correspond more to the expected behavior in the provided example on trumpet's platform.

Tradeoffs I made:

- Based on the requirements, it wasn't clear when a refresh would be initiated. Would the user click away from a textbox first and then refresh, or would they refresh while still typing?
    - I opted to save and store the contents of the textbox using a debounce strategy (when there's a change, start a timer and store data if there are no changes after 1 second). This way, if a user is typing in the textbox, doesn't click away, and refreshes, their data would likely still be saved.
    - This does make more requests than storing onBlur, but you gain in ensuring the most current data is stored. Further, we could have stored on every change in the textbox to save the most current data, however, this would make far too many requests, hurting performance.
- I used `Date.now()` as the identifier for the generated textboxes for simplicity. Techncially collisions are possible if two textboxes were created at the millisecond, but it would be unlikely. Since everything is running locally, this approach is sufficient for this project. However, for robustness, it would be prudent to use something more unique because if this were operating in a distriubted system, collisions could occur (date/time not the same on each machine).

