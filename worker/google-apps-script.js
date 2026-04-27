/**
 * Google Apps Script — Backend para assinaturas do Tarot CiberQuilombola
 *
 * INSTRUÇÕES:
 * 1. Crie uma planilha no Google Sheets
 * 2. Na planilha, adicione os headers na linha 1: Nome | Cidade | Data
 * 3. Vá em Extensões → Apps Script
 * 4. Cole este código no editor (apague o conteúdo existente)
 * 5. Clique em Deploy → Nova implantação
 *    - Tipo: Web App
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 6. Copie a URL gerada
 * 7. No arquivo .env do tarot: VITE_PETITION_API=URL_COPIADA
 *
 * Endpoints:
 *   GET  → retorna array JSON de assinaturas
 *   POST → adiciona assinatura { name, city }
 */

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var signatures = [];

  // Pula header (linha 1)
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      signatures.push({
        name: data[i][0],
        city: data[i][1] || null,
        date: data[i][2] || ''
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(signatures))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    var body = JSON.parse(e.postData.contents);
    var name = (body.name || '').trim();
    var city = (body.city || '').trim();

    if (!name || name.length < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Nome obrigatório (mín. 2 caracteres)' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var date = new Date().toISOString().slice(0, 10);
    sheet.appendRow([name.slice(0, 100), city.slice(0, 100), date]);

    var total = sheet.getLastRow() - 1; // minus header

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, total: total }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
