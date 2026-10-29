Run from the `server` folder. Create `server/.env.local` with your Apryse key:

```env
APRYSE_LICENSE_KEY=YOUR_DEMO_KEY
```

The web app uses `VITE_DEMO_KEY` in its own `.env.local`; the server uses `APRYSE_LICENSE_KEY`. Use the same key value. Restart after changing it. `.env.local` is ignored by Git.

```sh
npm install
npm start
```

```sh
curl http://127.0.0.1:5191/compare \
  -H 'Content-Type: application/json' \
  -d '{"before":"/absolute/path/old.pdf","after":"/absolute/path/new.pdf"}'
```

Example:
curl http://127.0.0.1:5191/compare \
 -H 'Content-Type: application/json' \
 -d '{
"before": "/Users/dave/Downloads/TPOV1_Master_S3.pdf",
"after": "/Users/dave/Downloads/TPOV1_Master_newer.pdf"
}'
