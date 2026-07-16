/* =====================================================================
   Local site configuration — the static-site equivalent of a .env file.
   ---------------------------------------------------------------------
   1. Copy this file to config.js   (in the same folder as index.html)
   2. Paste your Web3Forms access key below.

   config.js is GITIGNORED — it is never committed, so your key stays local.
   (The key is also safe to expose in frontend code: Web3Forms maps the key
   to your inbox on their side, and your email address never appears here.)

   How to get a key (one minute, no account):
     1. Go to https://web3forms.com
     2. Enter the inbox where you want submissions delivered
     3. Copy the "Access Key" it emails you
   ===================================================================== */

window.SITE_CONFIG = {
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY"
};
