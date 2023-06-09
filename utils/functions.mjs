/**
 * @param {number | string} x
 * @returns {string}
 */
export function addCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * @param {number} num
 * @returns {string}
 */
export function addSuffix(num) {
  let suffix = "th";
  if (num == 0) suffix = "";
  if (num % 10 == 1 && num % 100 != 11) suffix = "st";
  if (num % 10 == 2 && num % 100 != 12) suffix = "nd";
  if (num % 10 == 3 && num % 100 != 13) suffix = "rd";

  return num + suffix;
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1);
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomNum(min, max) {
  const difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}

/**
 * @param {number} count
 * @param {boolean} withAbbr
 * @param {number} decimals
 * @returns {string}
 */
export function abbreviate(count, withAbbr = true, decimals = 2) {
  count = Number(count);

  var neg = false;
  if (String(count)[0] == "-") {
    neg = true;
    count = ~Number(count) + 1;
  }

  const COUNT_ABBRS = ["", "K", "M", "B"];
  const i = 0 === count ? count : Math.floor(Math.log(count) / Math.log(1000));
  let result = parseFloat((count / Math.pow(1000, i)).toFixed(decimals));
  if (withAbbr) result += `${COUNT_ABBRS[i]}`;
  if (neg) result = `-${result}`;
  return result;
}

/**
 * @param {string} message
 * @returns {string}
 */
export function removeFormatting(message) {
  return message
    .replace(/`/g, "")
    .replace(/\*/g, "")
    .replace(/_/g, "")
    .replace(/~/g, "")
    .replace(/\'/g, "")
    .replace(/\"/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/\[/g, "")
    .replace(/\]/g, "")
    .replace(/\{/g, "")
    .replace(/\}/g, "")
    .replace(/-/g, "");
}

export function getRow(cur, embeds) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("prev")
      .setStyle(2)
      .setEmoji("994438542077984768")
      .setDisabled(cur === 0),
    new ButtonBuilder()
      .setCustomId("next")
      .setStyle(2)
      .setEmoji("994438540429643806")
      .setDisabled(cur === embeds.length - 1)
  );

  return row;
}
