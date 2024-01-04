import axios from 'axios';

async function fetchFunction(url, method = 'get', body = null) {
  try {
    let response;

    if (method.toLowerCase() === 'get') {
      response = await axios.get(url);
    } else if (method.toLowerCase() === 'post') {
      response = await axios.post(url, body);
    } else if (method.toLowerCase() === 'put') {
      response = await axios.put(url, body);
    } else if (method.toLowerCase() === 'delete') {
      response = await axios.delete(url);
    } else {
      throw new Error('Invalid HTTP method');
    }

    return response.data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

export default fetchFunction;
