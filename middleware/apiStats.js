import axios from 'axios';

const apiStats = async (req, res, next) => {
  try {
    const options = {
      headers: {
        'x-hasura-admin-secret':
          '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    };

    const { data } = await axios.get(
      'https://intent-kit-16.hasura.app/api/rest/blogs',
      options
    );

    const totalBlogs = data?.blogs?.length;

    let longestBlogTitle = '';
    for (let i = 0; i < data.blogs.length; i++) {
      if (data.blogs[i].title.length > longestBlogTitle.length) {
        longestBlogTitle = data.blogs[i].title;
      }
    }

    const blogWithTitlePrivacy = data?.blogs.filter((blog) =>
      blog.title.toLowerCase().includes('privacy')
    ).length;

    const uniqueBlogSet = new Set();
    const uniqueBlogs = data?.blogs.filter((blog) => {
      if (uniqueBlogSet.has(blog.title)) {
        return false;
      }
      uniqueBlogSet.add(blog.title);
      return true;
    });

    req.user = {
      totalBlogs,
      longestBlogTitle,
      blogWithTitlePrivacy,
      uniqueBlogs: [...uniqueBlogs],
    };
  } catch (error) {
    res.status(500).json({
      message: `Something Went Wrong `,
      Error: ` ${error.message}`,
    });
  }

  next();
};

export default apiStats;
