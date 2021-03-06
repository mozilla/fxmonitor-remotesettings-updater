"use strict";

const DEBUG = !process.env.PUSH_TO_KINTO;

const got = require("got");

const KINTO_UPDATE_ENDPOINT = "https://settings-writer.prod.mozaws.net/v1/buckets/main-workspace/collections/fxmonitor-breaches/records";
const PROD_RECORDS_ENDPOINT = "https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/fxmonitor-breaches/records";
const HIBP_BREACHES_ENDPOINT = "https://haveibeenpwned.com/api/v2/breaches";

const USERNAME = process.env.KINTO_USERNAME;
const PASSWORD = process.env.KINTO_PASSWORD;

if (!DEBUG && (!USERNAME || !PASSWORD)) {
  console.error("Please set credentials in the environment.");
  process.exitCode = 1;
  return;
}

const AUTH = Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64");

async function run() {
  const RemoteSettingsBreachesSet = new Set((await got(
    PROD_RECORDS_ENDPOINT,
    { json: true }
  )).body.data.map(b => b.Name));

  const hibpBreaches = (await got(
    HIBP_BREACHES_ENDPOINT,
    { json: true }
  )).body;

  const newBreaches = [];

  for (const breach of hibpBreaches) {
    if (breach.IsSpamList || breach.IsRetired || !breach.IsVerified || !breach.Domain) {
      continue;
    }

    if (RemoteSettingsBreachesSet.has(breach.Name)) {
      continue;
    }

    newBreaches.push(breach);
  }

  console.log(`${newBreaches.length} new breach(es) found.`);

  for (const breach of newBreaches) {
    const data = {
      Name: breach.Name,
      Domain: breach.Domain,
      BreachDate: breach.BreachDate,
      PwnCount: breach.PwnCount,
      AddedDate: breach.AddedDate,
    };

    if (DEBUG) {
      console.log(data);
      continue;
    }

    try {
      await got.post(KINTO_UPDATE_ENDPOINT, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Basic ${AUTH}`,
        },
        body: JSON.stringify({data: data}),
      });
    } catch (e) {
      console.error(e);
      process.exitCode = 1;
      return;
    }
  }
}

run();
