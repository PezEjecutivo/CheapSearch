// /api/scrape/route.ts
import { NextResponse } from "next/server";
import { chromium } from "playwright";

async function scrapeData(url: string) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { timeout: 30000 });

        const panelContainer = page.locator("div.panel-container");

        const imageSrc = await panelContainer.locator("div.data div.presentation picture img").getAttribute("data-src");
        const title = await panelContainer.locator("h1.game-title").textContent();
        const total = await panelContainer.locator("div.total").textContent({ timeout: 5000 });
        const discounted = await panelContainer.locator("div.discounted").textContent({ timeout: 5000 });
        const retail = await panelContainer.locator("div.retail").textContent({ timeout: 5000 });

        await browser.close();

        return {
            imageSrc,
            title: title ? title.trim() : null,
            total: total ? total.trim() : null,
            discounted: discounted ? discounted.trim() : null,
            retail: retail ? retail.trim() : null,
        };
    } catch (error: any) {
        console.error("Scraping failed:", error);
        await browser.close();
        throw new Error(`Failed to scrape data: ${error.message}`);
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL es requerida" }, { status: 400 });
    }

    try {
        const data = await scrapeData(url);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API route error:", error);
        return NextResponse.json({ error: `Error al realizar el scraping: ${error.message}` }, { status: 500 });
    }
}
