let ALLOWED_KEYS = "abcdefghijklmnopqrstuvwxyz";
let LIVES_AT_START = 10;
let lives_left = LIVES_AT_START;
let y = 200;
let x;
let z;
let arr = [];
let s;
let button;
let streak = 0;
let streak_highest = 0;
let g = "";
let b = [];
let num_of_characters;
let all_indices_found = [];
let text_list = [
  "DANMARK",
  "PROGRAMMERING",
  "GYMNASIUM",
  "ADVENTURESPEJDER",
  "JAZZ",
  "TIDSPUNKT",
  "DALMANTINER",
  "HOPPEBOLD",
  "SKEFULD",
  "HAVVAND",
  "VINTERVEJR",
  "BRILLEETUI",
  "TINSOLDAT",
  "XYLOFON",
  "VANDREHJEM",
  "UDFORDRING",
  "EMALJE",
  "KONFETTI",
  "LEVERPOSTEJ",
];
let DEBUG_MODE = true;

// Laver startside med overskrift og knap
// Hvis knappen trykkes startes spillet
function setup() {
  createCanvas(1400, 800);
  background(255);
  noStroke();

  button = createButton("Start Spil");
  button.position(575, 400);
  button.mousePressed(startGame);

  textSize(100);
  text("HANGMAN", 350, 100);
}

// Starter spillet ved at kalde alle de nødvendige funktioner og fjerne overskriften og knappen fra startsiden
function startGame() {
  button.remove();
  clear();
  htmlText();
  chooseWord();
  wordLength();
  drawLines();
}

// Denne funktion nulstiller de globale variable, som er afhængige af ordet, der bliver valgt
// Ud over det nulstiller den også livene
function reset() {
  g = "";
  b = [];
  all_indices_found = [];
  lives_left = LIVES_AT_START;
  clear();
}

// Denne funktion laver en knap på skærmen, og kalder en funktion, der starter spillet, hvis knappen trykkes
function playAgain() {
  fill(0);
  button = createButton("Spil Igen");
  button.position(600, 400);
  button.mousePressed(startGame);
}

// Denne funktion laver en overskrift, hvis spilleren gætter ordet
// Ordet bliver vis nedenunder
function resetAfterGameWon() {
  reset();
  textSize(50);
  text("TILLYKKE, DU GÆTTEDE ORDET:", 250, 100);
  fill(0, 255, 0);
  text(s, 500, 200);
  playAgain();
}

// Denne funktion laver en overskrift, hvis spilleren ikke gætter ordet
// Ordet bliver vist nedenunder
function resetAfterGameLost() {
  reset();
  textSize(50);
  text("DESVÆRRE, DU GÆTTEDE IKKE ORDET:", 150, 100);
  fill(255, 0, 0);
  text(s, 500, 200);
  playAgain();
}

// Denne funktion laver en overskrift over selve spillet
// Den viser hvad spillerens streak er på med html objekter
// Den skriver en besked om, hvilke bogstaver der er gættet på, som var forkerte
function htmlText() {
  textSize(32);
  text("Kan du gætte ordet?", 50, 70);
  textSize(20);
  text("Streak:", 1000, 70);
  text(streak, 1150, 70);
  text("Højeste Streak:", 1000, 100);
  text(streak_highest, 1150, 100);
  text("Forkerte bogstaver:", 50, 350);
}

// Denne funktion vælger et tilfældigt ord fra en given tekstliste og sætter streger ind i et array for hvert bogstav i det givne ord
function chooseWord() {
  s = random(text_list);
  for (j = 0; j < s.length; j++) {
    g += "-";
  }
}

// Denne funktion tæller antallet af karakterer i en streng
function wordLength() {
  num_of_characters = s.length;
  if (DEBUG_MODE) {
    print("Der er", num_of_characters, "bogstaver i ordet");
  }
}

// Denne funktion tegner antallet af streger på skærmen ved samme x-værdi, for bogstaver i det valgte ord
function drawLines() {
  x = 50;
  fill(0);
  for (j = 0; j < num_of_characters; j++) {
    rect(x, y, 50, 1);
    x += 75;
  }
}

function keyPressed() {
  // Den sidste indtastede tast på tastaturet bliver lavet til en streng
  let c = String.fromCharCode(keyCode);
  let pressedKey = c.toLowerCase();

  // Dette if-statement kører kun, hvis c er et bogstav
  if (ALLOWED_KEYS.includes(pressedKey)) {
    // Alle indekser i det valgte ord for karakteren c bliver sat ind i et array
    // Dette sker ved at kalde funktionen getAllIndices
    let indices_found = getAllIndices(s, c);

    // Løkken tjekker igennem alle indekser for indices_found
    for (let j = 0; j < indices_found.length; j++) {
      // Hvis ikke indekset for c er i arrayet all_indices_found, men i indices_found, bliver dette indsat
      if (!all_indices_found.includes(indices_found[j])) {
        all_indices_found.push(indices_found[j]);
        if (DEBUG_MODE) {
          print("Bogstavet", c, "er i ordet");
        }

        let a = 75;
        // Det indtastede bogstav bliver vist over den tilhørende streg på skærmen
        text(c, 63 + indices_found[j] * a, y - 25);
      } else if (all_indices_found.includes(indices_found[j]) && DEBUG_MODE) {
        // Hvis indices_found af indekstet allerede er i all_indices_found, betyder det, at spilleren allerede har gættet på dette bogstav, og denne besked bliver returneret til spilleren i konsollen
        print("Du har allerede gættet på", c);
      }
    }

    // Dette if-statement sker, hvis bogstavet der gættes på ikke er en del af ordet
    if (!s.includes(c) && keyCode != 0) {
      // Hvis c er inkluderet i arrayet b, som er de forkerte gættede bogstaver, har spilleren allerede gættet på dette
      if (b.includes(c) && DEBUG_MODE) {
        print("Du har allerede gættet på", c);
      } else {
        // Der trækkes et liv fra, når bogstavet er gættet forkert
        lives_left--;
        if (DEBUG_MODE) {
          print("Bogstavet", c, "er ikke i ordet");
          print("Du har", lives_left, "liv tilbage");
        }
        // Hvis ikke c er inkluderet i b, bliver det sat derind
        b.push(c);

        // Ud fra teksten "Forkerte bogstaver" fra funktionen htmlText, bliver de forkerte bogstaver skrevet
        fill(0);
        text(b, 50, 400);
      }
    }

    // Løkken går alle indekser af all_indices_found igennem og indsætter c på de tilsvarende steder i g, der er det af ordet, som spilleren har gættet indtil videre
    // Dette gøres ved at kalde til funktionen setCharAt
    for (let j = 0; j < all_indices_found.length; j++) {
      g = setCharAt(g, all_indices_found[j], s[all_indices_found[j]]);
    }
    if (DEBUG_MODE) {
      print(g);
    }

    // Kalder funktionen, der tjekker om spilleren har vundet
    checkGameWon();

    // Kalder funktionen, der tegner galgen, når der trækkes liv fra
    updateLifeStatus();
  }
}

function checkGameWon() {
  // Når ordet, og den del af ordet, som spilleren har gættet, er det samme, vindes spillet
  if (s == g) {
    if (DEBUG_MODE) {
      print("Flot, du gættede ordet", s);
    }
    // Kalder funktionen der opdaterer spillerens streak
    updateStreak();

    // Kalder funktionen, der nulstiller spillet efter sejr
    resetAfterGameWon();
  }
}

function updateStreak() {
  // Der bliver lagt en til spillerens streak
  streak++;
  // Hvis ens streak er højere end ens højeste streak, bliver den højeste streak det samme som ens streak
  if (streak > streak_highest) {
    streak_highest = streak;
  }
}

// Denne funktion sørger for, at en karakter bliver indsat i en bestemt streng på et bestemt index
// Der er tre argumenter: str, index og chr
function setCharAt(str, index, chr) {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
}

// Denne funktioner giver alle indekser fra en bestemt værdi i et bestemt array
// Denne funktion har to argumenter: arr og val.
function getAllIndices(arr, val) {
  var indices = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indices.push(i);
  }
  return indices;
}

// Denne funktion tegner hvert trin af galgen i forhold til, hvor mange liv spilleren har tilbage
function updateLifeStatus() {
  // Variablene t, a og f styrer galgens placering, størrelse og rektanglernes tykkelse
  let t = 350;
  let a = 20;
  let f = 1;
  noStroke();
  fill(0);

  if (lives_left == 9) {
    rect(t, t, f, 10 * a);
  }

  if (lives_left == 8) {
    rect(t, t, 8 * a, f);
  }

  if (lives_left == 7) {
    stroke(0);
    line(t + f, t + 2 * a, t + 2 * a, t + f);
  }

  if (lives_left == 6) {
    rect(t + 8 * a, t, f, 2 * a);
  }

  if (lives_left == 5) {
    circle(t + 8 * a, t + 3 * a, 2 * a);
    fill(255);
    circle(t + 8 * a, t + 3 * a, 2 * a - 2 * f);
  }

  if (lives_left == 4) {
    rect(t + 8 * a, t + 4 * a, f, 2 * a);
  }

  if (lives_left == 3) {
    stroke(0);
    line(t + 8 * a + f / 2, t + 6 * a, t + 7 * a, t + 8 * a);
  }

  if (lives_left == 2) {
    stroke(0);
    line(t + 8 * a + f / 2, t + 6 * a, t + 9 * a + f, t + 8 * a);
  }

  if (lives_left == 1) {
    stroke(0);
    line(t + 8 * a + f / 2, t + 5 * a, t + 6 * a, t + 4 * a);
  }

  if (lives_left == 0) {
    stroke(0);
    line(t + 8 * a + f / 2, t + 5 * a, t + 10 * a + f, t + 4 * a);
    if (DEBUG_MODE) {
      print("Du nåede ikke at gætte ordet");
      print("Ordet var", s);
    }
    streak = 0;

    // Kalder funktionen, der nulstiller spillet efter tab
    resetAfterGameLost();
  }
}
