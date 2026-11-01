// Starts a second Next dev server on port 3100 with its own build directory,
// so it can run next to the normal `npm run dev` server.
process.env.NEXT_DIST_DIR = ".next-test";
process.argv = [process.argv[0], "next", "dev", "-p", "3100"];
require("../node_modules/next/dist/bin/next");
