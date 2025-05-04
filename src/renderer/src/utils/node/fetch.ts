export const fetchPCGamingWiki = async (steamId: string) => {
  try {
    console.log('Fetching PCGaming Wiki for steamId:', steamId);
    const response = await fetch(`https://www.pcgamingwiki.com/api/appid.php?appid=${steamId}`);
    console.log('Response status:', response.status);

    if (!response.ok) {
      console.error('Response not ok:', response.statusText);
      return null;
    }

    const text = await response.text();
    console.log('Response received, length:', text.length);
    return text;
  } catch (error) {
    console.error('Error in fetchPCGamingWiki:', error);
    return null;
  }
}
