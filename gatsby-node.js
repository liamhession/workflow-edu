// Manually tell it how to handle any client-side route.
//      May eventually want to just bite the bullet and give all authenticated/client-side route a prefix, maybe `app.workflowedu.com/educators/*`?

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // page.matchPath is a special key that's used for matching pages only on the client.
  //    It is the actual path that will show up in the URL, or thought about another way, the URL that a client requesting will cause
  //      them to be shown the path described in `page.path.match(....)`
  if (page.path.match(/^\/app/)) {
    page.matchPath = '/profile';
    // Update the page.
    createPage(page);
  }
}