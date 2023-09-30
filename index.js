import express from 'express';
import axios from 'axios';
import pkg from 'lodash';
const { memoize } = pkg;
import apiStats from './middleware/apiStats.js';

const app = express();

app.get('/api/blog-stats', apiStats, (req, res) => {
  res.status(200).json(req.user);
});

app.get('/api/blog-search', async (req, res) => {
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

    const { query = '' } = req.query;
    console.log(query);

    const filterBlogs = data?.blogs?.filter((blog) =>
      blog.title.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(filterBlogs);
  } catch (error) {
    res.status(500).json({
      message: `Something Went Wrong `,
      Error: ` ${error.message}`,
    });
  }
});

app.listen(5000, () => console.log('running on port 5000'));
