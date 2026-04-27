/**
 * Google Apps Script — Backend para assinaturas do Tarot CiberQuilombola
 *
 * INSTRUÇÕES:
 * 1. Abra https://script.google.com e crie um novo projeto
 * 2. Cole este código (apague o conteúdo existente)
 * 3. No menu: Deploy → Nova implantação
 *    - Tipo: Web App
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL gerada
 * 5. No workflow do GitHub: adicione VITE_PETITION_API como secret
 *
 * Este script acessa APENAS a planilha especificada pelo ID abaixo.
 * Não pede permissão para todas as planilhas da conta.
 */

var SHEET_ID = '1PodBq4w1GgCmqho2WAI4G-L3-Xj1TI_pjnwDYTAHySM';

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
}

function doGet() {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var signatures = [];

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
  var sheet = getSheet();

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

    var total = sheet.getLastRow() - 1;

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, total: total }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
