const nodeFetch = async (url, init = {}) => {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(url, init);
    const data = await res.json();
    return data;
};

module.exports = {
    nodeFetch
};
