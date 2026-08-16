<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:user-rules -->
Never touch .env files. Do not create, edit, or delete them. If you need environment variables, just ask the user what the variables inside it are.
When coding, specifically in creating Next.js projects, always run `npm run build` first to ensure there are no errors before moving on.
When doing tasks from a checklist (like Phase 2), go at it strictly one by one. You are never allowed to go to other tasks or jump ahead unless the prior task is 100% completed.
If you're creating a new feature that needs a new page, make sure to add it in the sidebar nav too. Also, the Home link in the sidebar should always send the user back to the dashboard, not the landing page.
Always use Granular Streaming with React `<Suspense>` and Skeletons for data-fetching in Next.js App Router. Never settle for top-level `loading.tsx` files that block the entire page as a lazy "MVP" approach.
After completely building a new feature (without data), always ask the user if they are ready to seed the feature with mock data before doing it so they can visualize the UI.
<!-- END:user-rules -->
