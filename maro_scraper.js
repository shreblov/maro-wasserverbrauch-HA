export default async ({ page }) => {
  const Username = "DEINUSERNAME";
  const Passwort = "DEINPASSWORT!";

  // ab hier rumfummeln nur noch mit Ahnung
  
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Login Seite oeffnen
  await page.goto("https://home.maro.coffee/welcome/dashboard", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // auf Feld Username warten, eingeben und Submit Button betaetigen
  await page.waitForSelector('input[name="username"]', {
    visible: true,
    timeout: 60000,
  });

  await page.type('input[name="username"]', Username);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }),
    page.click("#usernamePrimaryButton"),
  ]);

  // auf Feld Passwort warten, eingeben und Submit Button betaetigen
  await page.waitForSelector("#i0118", {
    visible: true,
    timeout: 60000,
  });

  await page.type("#i0118", Passwort);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }),
    page.click("#idSIButton9"),
  ]);

  // auf Fenster "Angemeldet bleiben" warten und wenn vorhanden, Submit Button betaetigen
  try {
    await page.waitForSelector("#idBtn_Back", {
      visible: true,
      timeout: 5000,
    });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 60000 }),
      page.click("#idBtn_Back"),
    ]);
  } catch {}

  await page.waitForFunction(
    () => location.href.includes("/dashboard"),
    { timeout: 60000 }
  );

  // sicherheitshalber etwas warten
  await sleep(4000);

  // Navigation innerhalb der Single Page Application zu /my-maro
  await page.evaluate(() => {
    history.pushState({}, "", "/my-maro");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  await page.waitForFunction(
    () => location.href.includes("/my-maro"),
    { timeout: 15000 }
  );

  // auf Feld Total water used warten und Wert wasser extrahieren
  await page.waitForFunction(() => {
    return [...document.querySelectorAll("tr")].some(
      tr => tr.children[0]?.textContent?.trim() === "Total water used"
    );
  }, { timeout: 60000 });

  const wasser = await page.evaluate(() => {
    const row = [...document.querySelectorAll("tr")]
      .find(tr => tr.children[0]?.textContent?.trim() === "Total water used");

    return row?.children[1]?.textContent?.trim().replace("l", "").trim() ?? null;
  });

  return { wasser };

};