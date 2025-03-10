import fetch from 'node-fetch';

const studentEmail = 'jorgenfb@uia.no';

async function startInfiltration() {
  const url = `https://spacescavanger.onrender.com/start?player=${studentEmail}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Infiltration started:", data);
    return data;
  } catch (error) {
    console.error("Error starting infiltration:", error);
  }
}

async function getClosestPlanetToEarthTilt() {
  try {
    const earthUrl = 'https://api.le-systeme-solaire.net/rest/bodies/earth';
    const earthResponse = await fetch(earthUrl);
    const earthData = await earthResponse.json();
    const earthTilt = earthData.axialTilt;
    console.log("Earth's axial tilt:", earthTilt);
    const bodiesUrl = 'https://api.le-systeme-solaire.net/rest/bodies/';
    const bodiesResponse = await fetch(bodiesUrl);
    const bodiesData = await bodiesResponse.json();
    const planets = bodiesData.bodies.filter(body => body.bodyType === 'Planet' && body.englishName.toLowerCase() !== 'earth');
    let closestPlanet = null;
    let minDifference = Infinity;
    for (const planet of planets) {
      let tilt = planet.axialTilt;
      if (tilt === undefined || tilt === null) continue;
      if (tilt > 90) {
        tilt = 180 - tilt;
      }
      const effectiveEarthTilt = earthTilt > 90 ? 180 - earthTilt : earthTilt;
      const diff = Math.abs(effectiveEarthTilt - tilt);
      console.log("Comparing Earth (" + effectiveEarthTilt + ") with " + planet.englishName + " (" + tilt + ") => diff: " + diff);
      if (diff < minDifference) {
        minDifference = diff;
        closestPlanet = planet;
      }
    }
    return closestPlanet;
  } catch (error) {
    console.error("Error fetching planet data:", error);
  }
}

async function sendAnswer(answer) {
  const url = 'https://spacescavanger.onrender.com/answer';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, player: studentEmail })
    });
    const data = await response.json();
    console.log("Answer sent:", data);
    return data;
  } catch (error) {
    console.error("Error sending answer:", error);
  }
}

async function main() {
  await startInfiltration();
  const closestPlanet = await getClosestPlanetToEarthTilt();
  if (closestPlanet) {
    const answer = closestPlanet.englishName.trim();
    console.log("The planet with the axial tilt closest to Earth's is:", answer);
    await sendAnswer(answer);
  } else {
    console.error("Could not determine the closest planet.");
  }
}

main();
