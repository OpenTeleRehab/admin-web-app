import axios from 'utils/axios';

const getCategories = payload => {
  return axios.get('/category',
    {
      params: payload
    })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getCategoryTreeData = payload => {
  return axios.get('/category-tree',
    {
      params: payload
    })
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const getCategory = (id, language) => {
  const langParam = language ? `?lang=${language}` : '';

  return axios.get(`/category/${id}` + langParam)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const createCategory = payload => {
  return axios.post('/category', payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const updateCategory = (id, payload) => {
  return axios.put(`/category/${id}`, payload)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

const deleteCategory = id => {
  return axios.delete(`/category/${id}`)
    .then(
      res => {
        return res.data;
      }
    )
    .catch((e) => {
      return e.response.data;
    });
};

export const Category = {
  getCategories,
  getCategoryTreeData,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
