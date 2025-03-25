// /api/trends/route.ts
import { NextResponse } from "next/server";
import { chromium } from "playwright";

async function scrapeTrendingGames(url: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { timeout: 30000 });

        const listingItems = page.locator("div.search.listing-items");
        const gameItems = await listingItems.locator("div.item.force-badge").all();

        const games = [];
        const maxGamesToScrape = 3;

        for (let i = 0; i < Math.min(gameItems.length, maxGamesToScrape); i++) {
            const item = gameItems[i];
            try {
                const linkElement = await item.locator("a.cover.video.is-playable.played");
                const href = await linkElement.getAttribute("href");

                const titleElement = await item.locator("span.title");
                const title = await titleElement.textContent({ timeout: 5000 });

                if (href && title) {
                    games.push({
                        href,
                        title: title.trim(),
                    });
                }
            } catch (error) {
                console.error("Error extracting data from a game item:", error);
            }
        }

        await browser.close();
        return games;
    } catch (error: any) {
        console.error("Scraping failed:", error);
        await browser.close();
        throw new Error(`Failed to scrape trending games: ${error.message}`);
    }
}

export async function GET(request: Request) {
    const url = "https://www.instant-gaming.com/es/tendencias/";

    try {
        const data = await scrapeTrendingGames(url);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API route error:", error);
        return NextResponse.json({ error: `Error al realizar el scraping: ${error.message}` }, { status: 500 });
    }
}
