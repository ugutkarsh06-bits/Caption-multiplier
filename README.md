# Multiplier — setup guide

Follow these steps in order. None of them require writing code.

## 1. Get an Anthropic API key
1. Go to https://console.anthropic.com and sign up.
2. Add a payment method and load a small amount of credit ($5–10 is plenty to start).
3. Go to Settings → API Keys → Create Key. Copy it somewhere safe — you'll paste it into Vercel in step 4.

## 2. Upload this project to GitHub
1. Go to https://github.com and create a free account if you don't have one.
2. Click "New repository." Name it `multiplier`. Keep it public or private, either works.
3. On the new repo page, click "uploading an existing file" and drag in every file from this folder (`index.html`, `package.json`, `README.md`, and the whole `api` folder with both files inside it).
4. Commit the files.

## 3. Deploy on Vercel
1. Go to https://vercel.com and sign up (you can sign up directly with your GitHub account — this makes step 3→4 seamless).
2. Click "Add New… → Project," then select the `multiplier` repo you just created.
3. Before clicking Deploy, open "Environment Variables" and add:
   - `ANTHROPIC_API_KEY` = the key you copied in step 1
   - `GUMROAD_PRODUCT_PERMALINK` = you'll fill this in after step 4 below (come back and add it, then redeploy)
4. Click Deploy. You'll get a live URL like `multiplier-yourname.vercel.app`.

## 4. Set up payment on Gumroad
1. Go to https://gumroad.com and create a free account.
2. Create a new product — e.g. "Multiplier — lifetime access," priced however you like ($5–15 is typical for a tool like this).
3. In the product's settings, find "Generate a unique license key per sale" and turn it on.
4. In the product's content/thank-you page text, tell buyers: "Go to [your Vercel URL] and paste your license key to unlock."
5. Copy your product's permalink (the short code at the end of your Gumroad product URL, e.g. if your link is `gumroad.com/l/abc123`, the permalink is `abc123`).
6. Go back to Vercel → your project → Settings → Environment Variables → add/update `GUMROAD_PRODUCT_PERMALINK` with that value → redeploy.

## 5. Connect the buy link in the app
Open `index.html`, find this line near the top of the `<script>` section:
```
const BUY_LINK = 'https://gumroad.com/l/YOUR_PRODUCT_HERE';
```
Replace it with your actual Gumroad product link, then re-upload the changed file to GitHub (Vercel will auto-redeploy).

## 6. Test it end to end
1. Buy your own product on Gumroad (or use Gumroad's test/preview mode) to get a license key.
2. Go to your live Vercel URL, paste the license key, confirm it unlocks.
3. Paste in some source content and confirm "Multiply this" generates results.

## 7. Start sharing it
Post the Gumroad product link (not the raw Vercel URL) in places creators hang out — r/SideProject, r/ContentCreators, Indie Hackers, creator Discord servers — with a short "made this to stop manually rewriting my posts for every platform" pitch.

## Costs to expect
- Vercel hosting: free at this scale.
- Gumroad: free to list, takes a small % per sale.
- Anthropic API: roughly a fraction of a cent to a few cents per generation depending on content length — your $5-10 credit will cover a lot of test runs and early customers.
