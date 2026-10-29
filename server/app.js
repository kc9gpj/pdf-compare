const express = require('express');
const { PDFNet } = require('@pdftron/pdfnet-node');
const { mkdir } = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const app = express();
app.use(express.json());
let busy = false;

app.get('/', (_req, res) => res.json({ usage: 'POST /compare with { before: "/path/old.pdf", after: "/path/new.pdf" }' }));

app.post('/compare', async (req, res) => {
  const { before, after } = req.body || {};
  if (typeof before !== 'string' || typeof after !== 'string') {
    return res.status(400).json({ error: 'Provide before and after PDF file paths.' });
  }
  if (busy) return res.status(409).json({ error: 'A comparison is already running.' });
  busy = true;
  try {
    const output = path.join(__dirname, 'output', `${randomUUID()}.pdf`);
    await mkdir(path.dirname(output), { recursive: true });
    let differences;
    await PDFNet.runWithCleanup(async () => {
      const oldDoc = await PDFNet.PDFDoc.createFromFilePath(path.resolve(before));
      const newDoc = await PDFNet.PDFDoc.createFromFilePath(path.resolve(after));
      await oldDoc.initSecurityHandler();
      await newDoc.initSecurityHandler();
      const result = await PDFNet.PDFDoc.create();
      differences = await result.appendTextDiffDoc(oldDoc, newDoc);
      await result.save(output, PDFNet.SDFDoc.SaveOptions.e_linearized);
    }, process.env.APRYSE_LICENSE_KEY || '');
    res.json({ differences, output });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  } finally {
    busy = false;
  }
});

app.listen(5191, '127.0.0.1', () => console.log('Apryse comparison API: http://127.0.0.1:5191'));
