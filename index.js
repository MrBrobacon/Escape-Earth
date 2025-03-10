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

async function getSunPin() {
  const url = 'https://api.le-systeme-solaire.net/rest/bodies/sun';
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Sun data:", data);
    
    const equaRadius = data.equaRadius;
    const meanRadius = data.meanRadius;
    
    if (!equaRadius || !meanRadius) {
      console.error("Error: Missing radii data from the Sun response.");
      return null;
    }
    
    const pin = equaRadius - meanRadius;
    console.log(`Computed Sun pin: ${pin}`);
    return pin;
  } catch (error) {
    console.error("Error fetching Sun data:", error);
  }
}

async function sendAnswer(answer) {
  const url = 'https://spacescavanger.onrender.com/answer';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
  const pin = await getSunPin();     
  if (pin !== null) {
    await sendAnswer(pin);           
  } else {
    console.error("Pin could not be computed due to missing data.");
  }
}

main();