
const login = user => {
  return {
      type: 'LOGIN',
      user,
  };
};

export default {
  login
}