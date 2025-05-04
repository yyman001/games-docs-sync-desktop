import * as cheerio from 'cheerio'
import { callNodeAsync } from './ipc'
import { IpcParameter } from '@/types'

export interface fullGameTable {
  title: string;
  content: string;
}

export const fullGame = async (steamId: string): Promise<Array<fullGameTable>|null> => {
  try {
    console.log('Fetching data for steamId:', steamId);
    const html = await callNodeAsync({
      modName: 'fetchModule',
      functionName: 'fetchPCGamingWiki',
      data: steamId
    } as IpcParameter);

    if (!html) {
      console.error('Failed to fetch PCGaming Wiki data');
      return null;
    }

    const table: Array<fullGameTable> = [];
    const $ = cheerio.load(html);
    const saveLocations = $('#table-gamedata');

    saveLocations.each(function (this: cheerio.Element) {
      const tr = $(this).find('tr');
      tr.each(function (this: cheerio.Element) {
        const title = $(this).children().eq(0).text().replace(/^\s+|\s+$/g, '');
        const content = $(this).children().eq(1).text().replace(/^\s+|\s+$/g, '');

        table.push({
          title,
          content
        } as fullGameTable);
      });
    });

    return table;
  } catch (error) {
    console.error('Error fetching game data:', error);
    return null;
  }
}
