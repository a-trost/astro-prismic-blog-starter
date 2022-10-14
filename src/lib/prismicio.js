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

const cache = new Map();

/**
 * A Prismic client for the project's repository. The client is used to query
 * content from the Prismic API.
 */
const client = prismic.createClient(sm.apiEndpoint, {
  routes,
  fetch: async (url, options) => {
    const { pathname } = new URL(url);

    // Use cached results for `/documents/search` requests
    if (/\/documents\/search\/?/.test(pathname)) {
      // The cache key contains the requested URL and headers
      const key = JSON.stringify({ url, options });

      if (cache.has(key)) {
        // If the cache contains a value for the key, return it
        return new Response(cache.get(key));
      } else {
        // Otherwise, make the network request
        const res = await fetch(url, options);

        if (res.ok) {
          // Using `.text()` allows the consumer to re-parse as
          // JSON while being able to save to the cache reliably.
          const text = await res.text();

          // If the request was successful, save it to the cache
          cache.set(key, text);

          return new Response(text);
        } else {
          return res;
        }
      }
    } else {
      return await fetch(url, options);
    }
  },
});

/**
 * Functions to fetch Prismic content
 */

export async function getSettings() {
  return await client.getSingle("settings");
}

export async function getMenu() {
  return await client.getSingle("menu");
}

export async function getAllPages() {
  return await client.getAllByType("page");
}

export async function getAllBlogPosts() {
  return await client.getAllByType("blogpost");
}

export async function getPageByUID(uid) {
  return await client.getByUID("page", uid);
}

export async function getHomepage() {
  return await client.getSingle("homepage");
}
