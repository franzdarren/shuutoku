/** Printed to the console on load. Anyone who opens devtools can read every
 *  question and every answer out of the content chunk, which is unavoidable
 *  on a site with no server, so this says so in plain language instead of
 *  letting someone assume it's a bug. Written in the repo owner's voice. */
const REPO = "https://github.com/franzdarren/shuutoku";

export function printConsoleNote() {
  const head = "font:700 17px/1.6 serif; color:#29466F;";
  const soft = "font:400 12px/1.75 system-ui; color:#5B5648;";
  const rule = "color:#8B8474;";
  const body = "font:400 12px/1.75 system-ui; color:#24211D;";
  const warm = "font:600 12px/1.75 system-ui; color:#A67C2E;";
  const quote = "font:400 13px/1.8 serif; color:#29466F;";

  console.log(
    "\n%c習得 Shuutoku" +
      "%c\nn4 review handbook\n" +
      "%c" + "─".repeat(50) + "\n\n" +

      "%chey. yeah, you can read everything in here.\n\n" +

      "%cI originally made this just for me. I was sitting around 65% on N4 mock " +
      "tests, knew the syllabus fine but kept dropping points on the same handful " +
      "of things, and got tired of flipping between Minna, Genki and Sou Matome to " +
      "chase them down. so I built this instead. then I figured other people are " +
      "probably stuck in the exact same spot, so, deploying it I guess.\n\n" +

      "heads up on what you're looking at though. it's a static site. no server, " +
      "no database. every grammar point, kanji, reading passage and quiz answer " +
      "gets shipped straight to your browser as one big file.\n\n" +

      "like, right now, if you went to the Sources tab (or Debugger in firefox), " +
      "opened assets/ and clicked the file starting with content-, you'd be " +
      "looking at the entire handbook. every question in there sits next to a " +
      'field called "a" and that number is the index of the correct choice. ' +
      '"a":1 means the second option. the explanation and the why-the-others-' +
      "are-wrong notes are right there too, before you've answered anything. " +
      "Network tab shows you the same file. so does view-source, basically.\n\n" +

      "I could try to hide it but honestly I'm too fucking stupid or lazy to do " +
      "allat, and anything your browser can show you it already downloaded " +
      "anyway, so what would even be the point.\n\n" +

      "%cupside though:\n\n" +

      "%c  offline. visit once and the whole handbook is cached. install it from " +
      "the address bar (or Share, then Add to Home Screen) and it works on a plane.\n\n" +
      "  no tracking. your progress lives in localStorage on your own device. " +
      "there's nowhere for it to go even if I wanted it to, which I don't.\n\n" +
      "  it's yours. read it, fork it, fix my furigana:\n  " + REPO + "\n\n" +

      "%calso, credit where it's due: Claude wrote like 99% of this. maybe 100%. " +
      "I mostly sat here going \"the background is too brown\" and \"why is the " +
      "text invisible in dark mode\" until it stopped being both of those things.\n\n" +

      "%cone thing though, please don't cheat the mock exam. you'd only be " +
      "cheating yourself, which is genuinely the bleakest kind.\n\n" +

      "%c「七転び八起き」\n" +
      "fall down seven times, get up eight. or whatever. good luck with N4.\n",

    head, soft, rule, body, soft, body, soft, warm, soft, quote
  );
}
