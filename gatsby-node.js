// Manually tell it how to handle any client-side route.
//      May eventually want to just bite the bullet and give all authenticated/client-side route a prefix, maybe `app.workflowedu.com/educators/*`?

// Implement the Gatsby API “onCreatePage”. This is called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // page.matchPath is a special key that's used for matching pages only on the client.
  //    Its addition allows for a request to /educator/* (page.path.match(...)) to find the right page under the /educator router
  if (page.path.match(/^\/educator/)) {
    page.matchPath = '/educator/*';
    // Update the page.
    createPage(page);
  }
}