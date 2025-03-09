import { GoogleSpreadsheet } from 'google-spreadsheet';
import env from '#config/env/env.js';
// HINT: if you want to use credentials from a .json file, you can uncomment the following code below and comment OR delete env import above
// import credentials from 'PATH_TO_YOUR_CREDENTIALS_FILE.json' assert { type: "json" };
import knex from '#postgres/knex.js';
import { JWT } from 'google-auth-library'

export const loadGoogleSpreadsheetInfo = async (sheetId: string): Promise<void> => {

  const serviceAccountAuth = new JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // HINT: if you want to use credentials from a .json file, you can uncomment the following code and comment the code above
  // const serviceAccountAuth = new JWT({
  //   email: credentials.client_email,
  //   key: credentials.private_key,
  //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  // });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();

  const tariffsSortedByDate = await knex('tariffs')
    .distinct('date')
    .orderBy('date', 'desc')

  if(tariffsSortedByDate.length === 0) {
    console.log('No data in table tariffs');
    return;
  }

  for(const tariffDate of tariffsSortedByDate) {
    const readableDate = tariffDate.date.toISOString().split('T')[0];

    const tariffsData = await knex('tariffs')
      .select('*')
      .where('date', tariffDate.date)
      .orderByRaw('CAST(box_delivery_and_storage_expr AS FLOAT)');

    if(tariffsData) {

      try {
        const sheetTitle = `stocks_coef_${readableDate}`

        let sheet = doc.sheetsByTitle[sheetTitle];

        if(!sheet) {
          sheet = await doc.addSheet({ 
            title: sheetTitle,  
            headerValues: [
              'date',
              'date_and_time',
              'box_delivery_and_storage_expr',
              'box_delivery_base',
              'box_delivery_liter',
              'box_storage_base',
              'box_storage_liter',
              'warehouse_name'
            ] 
          });
        } else {
          await sheet.clearRows();
        }
        
        const formattedData = tariffsData.map(row => ({
          ...row,
          date: readableDate,
        }));
     
        await sheet.addRows(formattedData);
  
      } catch (error) {
        console.error(error);
      }
    }
  }
}