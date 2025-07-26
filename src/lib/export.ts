
import type { IdData } from "@/ai/flow";

const cardsPerPage = 4;

export const generateExportHtml = (cardData: IdData[]) => {
    const numPages = Math.ceil(cardData.length / cardsPerPage);
    const pages = Array.from({ length: numPages }, (_, i) => {
        const start = i * cardsPerPage;
        const end = start + cardsPerPage;
        return cardData.slice(start, end);
    });

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ID Batcher Export</title>
        <style>
          @page { size: A4 portrait; margin: 1cm; }
          body { font-family: sans-serif; }
          .page { width: 190mm; height: 277mm; page-break-after: always; display: flex; flex-direction: column; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; flex-grow: 1; }
          .card-container { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #000; overflow: hidden; display: flex; flex-direction: column; height: 54mm; width: 85.6mm; }
          .card-header { display: flex; justify-content: space-between; align-items: center; }
          .card-title { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #1e3a8a; }
          .card-content { margin-top: 8px; font-size: 10px; flex-grow: 1; overflow: hidden; }
          .detail-label { font-size: 8px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
          .detail-value { font-family: monospace; font-size: 10px; font-weight: bold; white-space: pre-wrap; word-wrap: break-word; }
          .card-footer { height: 4px; background: linear-gradient(to right, #3b82f6, #8b5cf6); border-radius: 9999px; margin-top: auto; }
          h2 { font-family: 'Space Grotesk', sans-serif; text-align: center; }
        </style>
      </head>
      <body>
    `;

    pages.forEach((pageData, pageIndex) => {
      html += `<div class="page"><h2>Page ${pageIndex + 1}</h2><div class="grid">`;
      for (let i = 0; i < cardsPerPage; i++) {
        const cardDataItem = pageData[i];
        if (cardDataItem) {
          const escapedText = (cardDataItem.otherDetails || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          // Front
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">PDF Document (Front)</span></div>
            <div class="card-content">
              <div><p class="detail-label">File Name</p><p class="detail-value" style="word-break: break-all;">${cardDataItem.name || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
          // Back
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">Extracted Text (Back)</span></div>
            <div class="card-content">
              <div><p class="detail-label">Content</p><p class="detail-value">${escapedText || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
        } else {
          html += '<div></div><div></div>'; // empty cells for both columns
        }
      }
      html += `</div></div>`;
    });

    html += '</body></html>';
    return html;
  };
