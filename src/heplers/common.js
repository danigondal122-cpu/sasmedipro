// export function formatNumber(num) {
//   if (num === null || num === undefined) return "0";

//   const number = Number(num);
//   if (isNaN(number)) return "0";

//   const abs = Math.abs(number); // work with absolute value for formatting
//   let formatted = "";

//   if (abs >= 1_000_000) {
//     formatted = (abs / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
//   } else if (abs >= 1_000) {
//     formatted = (abs / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
//   } else {
//     formatted = abs.toString();
//   }

//   // prepend negative sign if original number was negative
//   return number < 0 ? "-" + formatted : formatted;
// }
