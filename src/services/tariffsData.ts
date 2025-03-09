import knex from '#postgres/knex.js';
import env from '#config/env/env.js';
import { Warehouse, TariffsBoxApiResponse } from '#types/types.js';

const getTariffsData = async () => {
    try {
        const dateAndTime = new Date();
        const today = dateAndTime.toISOString().split('T')[0];
        const queryParams = new URLSearchParams({
            date: today
        });

        const response = await fetch(`https://common-api.wildberries.ru/api/v1/tariffs/box?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${env.WILDBERRIES_API_KEY}`
            }
        });
        const data = await response.json();
        
        await saveTariffsData(data, dateAndTime);
        
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const saveTariffsData = async (data: TariffsBoxApiResponse, dateAndTime: Date) => {
    if (!data?.response?.data?.warehouseList) {
        console.error('No data to save');
        return;
    }
    
    const date = new Date(dateAndTime.getFullYear(), dateAndTime.getMonth(), dateAndTime.getDate());

    const tariffs = data.response.data.warehouseList.map((warehouse: Warehouse) => ({
        date: date,
        date_and_time: dateAndTime,
        box_delivery_and_storage_expr: warehouse.boxDeliveryAndStorageExpr,
        box_delivery_base: warehouse.boxDeliveryBase,
        box_delivery_liter: warehouse.boxDeliveryLiter,
        box_storage_base: warehouse.boxStorageBase === '-' ? null : warehouse.boxStorageBase,
        box_storage_liter: warehouse.boxStorageLiter === '-' ? null : warehouse.boxStorageLiter,
        warehouse_name: warehouse.warehouseName,
    }));

    try {
        await knex('tariffs')
          .insert(tariffs)
          .onConflict(['warehouse_name', 'date'])
          .merge();
      } catch (error) {
        console.error('Cannot save data:', error);
      }
}

export const scheduleTariffsDataFetch = () => {
    getTariffsData().catch(error => 
        console.error('Initial request error:', error)
    );
    
    setInterval(() => {
        getTariffsData().catch(error => 
            console.error('Request error:', error)
        );
    }, 3600000);
    
    console.log('Tariffs Data Service is running.');
}