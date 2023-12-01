// Function to prompt the user for input
function promptUser() {
  return;
}

// Function to retrieve answer from API
async function getAnswerFromAPI(question) {
  // Capitalize the first letter of the question
  question = question.charAt(0).toUpperCase() + question.slice(1);

  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${question}`
  );
  const data = await response.json();
  return data;
}
// Function to check if input matches basic questions and retrieve answer
async function getBasicAnswer(question) {
  let answer = "";
  if (question.toLowerCase().includes("what is your name")) {
    answer = {
      extract: `
      My name is Wiki Bot.
      I am a chat bot.
      I am still learning how to answer questions.
      I hope to be able to answer more questions in the future.
    `,
    };
  } else if (question.toLowerCase().includes("what is the date")) {
    answer = { extract: `Today is ${new Date().toLocaleDateString()}.` };
  } else if (question.toLowerCase().includes("what is the time")) {
    answer = { extract: `The time is ${new Date().toLocaleTimeString()}.` };
  } else if (question.toLowerCase().includes("what is")) {
    const words = question.split(" ");
    const name = words.slice(words.indexOf("is") + 1).join(" ");
    answer = await getAnswerFromAPI(name);
  } else if (question.toLowerCase().includes("who is")) {
    const words = question.split(" ");
    // Note, name can include fist name and last name
    const name = words.slice(words.indexOf("is") + 1).join(" ");
    response = await getAnswerFromAPI(name);
    if (response) {
      answer = response;
    } else {
      answer = "Sorry, I cant any information on that person.";
    }
  } else {
    answer = "Sorry, I don't understand your question.";
  }
  return answer;
}

// Form Functions

// Input Field
let input = document.getElementById("input_field");

// Submit handler
async function submitHandler(e) {
  e.preventDefault();
  // Messages Div
  let messages = document.getElementById("messages");
  // Add new message from user to messages div
  messages.innerHTML += `<div class="message-from-user">${input.value}</div>`;
  // Get answer
  const answer = await getBasicAnswer(input.value);
  // Add new message from bot to messages div
  messages.innerHTML += `<div class="message-from-bot">
  <img src=${answer.originalimage.source} alt="Image" class="bot-image" />
  ${answer.extract}</div>`;
  // Clear input field
  input.value = "";
}

// Speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

let isListening = false; // Add a flag to track if it's listening

// Function to start speech recognition
function startSpeechRecognition() {
  const recordImage = document.getElementById("record_img");
  // If speech recognition has started, stop it
  if (isListening) {
    recognition.stop();
    isListening = false;
  } else {
    recognition.start();
    recordImage.src = "/audio-wave.gif";
    isListening = true;
  }
}

// Function to handle speech recognition results
recognition.onresult = async function (event) {
  const recordImage = document.getElementById("record_img");
  recordImage.src =
    "https://img.icons8.com/?size=250&id=Jo53NUQZiyi7&format=png";
  const speechResult = event.results[0][0].transcript;
  input.value = speechResult;

  let messages = document.getElementById("messages");
  // Add new message from user to messages div
  messages.innerHTML += `<div class="message-from-user">${input.value}</div>`;
  // Get answer
  const answer = await getBasicAnswer(input.value);
  console.log(answer);
  // Add new message from bot to messages div
  messages.innerHTML += `<div class="message-from-bot">
  <img src=${answer.originalimage.source}  alt="Image" class="bot-image" />
  ${answer.extract}</div>`;

  // Split the text into sentences
  const sentences = answer.extract.split(". ");

  // Join the first two sentences
  const firstTwoSentences = sentences.slice(0, 2).join(". ");

  // Read aloud the first two sentences
  const utterance = new SpeechSynthesisUtterance(firstTwoSentences);
  speechSynthesis.speak(utterance);

  // Clear input field
  input.value = "";
};
