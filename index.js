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
  const orders = await startInfiltration();

  await sendAnswer(answer);
}

main();