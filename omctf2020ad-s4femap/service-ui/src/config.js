let apiPort = process.env.REACT_APP_API_PORT || 3001
let apiHost = process.env.REACT_APP_API_HOST || ( window.location.protocol + "//" + window.location.host.split(":")[0] )
export const API_URL = `${apiHost}:${apiPort}/api/`;
