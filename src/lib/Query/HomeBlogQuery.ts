const HomeBlogQuery = `
query HomeBlogQuery {
  posts(first: 4) {
    edges {
      node {
        ... on Post {   # Ensures we get Post-specific fields
         id
          title
          slug
          date
          excerpt
        }
          featuredImage {  # Fetch the featured image
            node {
              sourceUrl   # Get the image URL
              altText     # Get the alt text (useful for SEO)
            }
          }
      }
    }
  }
}

`;
export default HomeBlogQuery;
