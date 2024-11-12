import { GoogleAuth, JWT } from "google-auth-library";

async function getAccessToken() {
  //   return new Promise(function (resolve, reject) {
  //     const key = require("../placeholders/service-account.json");
  //     const jwtClient = new JWT(
  //       key.client_email,
  //       null,
  //       key.private_key,
  //       SCOPES,
  //       null
  //     );
  //     jwtClient.authorize(function (err, tokens) {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(tokens.access_token);
  //     });
  //   });
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({ url });
  console.log(res.data);
}

export default getAccessToken;
