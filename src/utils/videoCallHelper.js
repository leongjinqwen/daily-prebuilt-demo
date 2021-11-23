
// const API_URL =  process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_API_URL}/api` : "https://api.daily.co/v1" 
const API_URL = "https://api.daily.co/v1" 

const DAILY_TOKEN = process.env.REACT_APP_DAILY_API_KEY

/**
 * Create a short-lived room for demo purposes.
 *
 * It uses the redirect proxy as specified in netlify.toml`
 * This will work locally if you following the Netlify specific instructions
 * in README.md
 *
 * See https://docs.daily.co/reference#create-room for more information on how
 * to use the Daily REST API to create rooms and what options are available. 
 */

async function createRoom() {

  const exp = Math.round(Date.now() / 1000) + 60 * 30;
  const options = {
    properties: {
      exp: exp,
      enable_chat: true,
    },
  };
  let response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    body: JSON.stringify(options),
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + DAILY_TOKEN,
      'Host': 'api.producthunt.com'
    }
  }),
    room = await response.json();
  return room;

  // Comment out the above and uncomment the below, using your own URL
  // return { url: "https://your-domain.daily.co/hello" };
}

export default { createRoom };