module.exports = {
  basePath: "",
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/blog/",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
