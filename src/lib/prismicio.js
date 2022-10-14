import * as prismic from "@prismicio/client";
import sm from "../../sm.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

// Update the routes array to match your project's route structure
/** @type {prismic.ClientConfig['routes']} **/
const routes = [
  {
    type: "homepage",
    path: "/",
  },
  {
    type: "page",
    path: "/:uid",
  },
  {
    type: "blogpost",
    path: "/blog/:uid",
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *

 */

const client = prismic.createClient(sm.apiEndpoint, {
  routes,
});

/*

Functions to fetch Prismic content

*/

// Cache for quicker builds
let settings, menu, allPages, allBlogPosts;

export async function getSettings() {
  if (settings) {
    return settings;
  }

  const response = client.getSingle("settings");
  settings = await response;
  return settings;
}

export async function getMenu() {
  if (menu) {
    return menu;
  }

  const response = client.getSingle("menu");
  menu = await response;
  return menu;
}

export async function getAllPages() {
  if (allPages) {
    return allPages;
  }

  const response = client.getAllByType("page");
  allPages = await response;
  return allPages;
}

export async function getAllBlogPosts() {
  if (allBlogPosts) {
    return allBlogPosts;
  }

  const response = client.getAllByType("blogpost");
  allBlogPosts = await response;

  return allBlogPosts;
}

export async function getPageByUID(uid) {
  const response = client.getByUID("page", uid);
  return await response;
}

export async function getHomepage() {
  const response = client.getSingle("homepage");
  return await response;
}
