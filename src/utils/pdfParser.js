import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Tell pdf.js where the worker file is
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [hm, ap] = timeStr.split(" ");
  let [h, m] = hm.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function isDuplicateOrClose(existing, candidate) {
  if (!existing) return false;
  const diff = Math.abs(timeToMinutes(existing) - timeToMinutes(candidate));
  return diff <= 1;
}

export function stripAMPM(timeStr) {
  if (!timeStr) return "";
  return timeStr.replace(/\s*(AM|PM)$/i, "");
}

export async function parseDTRPdf(file, onProgress) {
  const buffer = await file.arrayBuffer();
  const typedarray = new Uint8Array(buffer);

  const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

  let textContent = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    text.items.forEach((item) => (textContent += item.str + " "));

    const percent = Math.round((i / pdf.numPages) * 100);
    onProgress?.(percent);
  }

  let empName = "_____________________";
  let period = "For the month of _____________";

  const nameMatch = textContent.match(/Employee\s+(.*?)\s+Position/);
  if (nameMatch) empName = nameMatch[1];

  const periodMatch = textContent.match(/Period\s+([A-Za-z0-9\s\-]+)/);
  if (periodMatch) period = periodMatch[1];

  const yearMatch = textContent.match(/\d{2}\/\d{2}\/(\d{4})/);
  if (yearMatch) {
    const year = yearMatch[1];
    period = `${period} ${year}`;
  }

  // Extract date range and build cutoff (1–15 / 16–31 / full month)
  const allDates = [...textContent.matchAll(/\d{2}\/(\d{2})\/(\d{4})/g)];
  if (allDates.length > 0) {
    const days = allDates.map((m) => parseInt(m[1]));
    const minDay = Math.min(...days);
    const maxDay = Math.max(...days);
    const year = parseInt(allDates[0][2]);

    const firstDate = allDates[0][0];
    const monthNum = parseInt(firstDate.split("/")[0]);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[monthNum - 1];

    let startDay = minDay;
    let endDay = maxDay;

    if (maxDay <= 15) {
      startDay = 1;
      endDay = 15;
    } else if (minDay >= 16) {
      startDay = 16;
      endDay = 31;
    } else if (minDay === 1 && (maxDay === 30 || maxDay === 31)) {
      startDay = 1;
      endDay = maxDay;
    }

    period = `${monthName} ${startDay} - ${endDay}, ${year}`;
  }

  const rows =
    textContent.match(/\d{7}\s+\w+\s+\d{2}\/\d{2}\/\d{4}.*?(?=\d{7}|$)/gs) ||
    [];

  const logsByDay = {};
  rows.forEach((r) => {
    const parts = r.trim().split(/\s+/);
    const date = parts[2];
    const dayNum = parseInt(date.split("/")[1]);
    const timeStr = parts[3] + " " + parts[4];
    const mode = parts[5];

    if (!logsByDay[dayNum])
      logsByDay[dayNum] = { amIn: "", amOut: "", pmIn: "", pmOut: "" };

    let [hm, ap] = [parts[3], parts[4]];
    let [h, m] = hm.split(":").map(Number);
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    const hour24 = h;

    if (mode === "In") {
      if (hour24 < 12) {
        if (!isDuplicateOrClose(logsByDay[dayNum].amIn, timeStr))
          logsByDay[dayNum].amIn ||= timeStr;
      } else {
        if (!isDuplicateOrClose(logsByDay[dayNum].pmIn, timeStr))
          logsByDay[dayNum].pmIn ||= timeStr;
      }
    } else if (mode === "Out") {
      if (hour24 < 13) {
        if (!isDuplicateOrClose(logsByDay[dayNum].amOut, timeStr))
          logsByDay[dayNum].amOut ||= timeStr;
      } else {
        if (!isDuplicateOrClose(logsByDay[dayNum].pmOut, timeStr))
          logsByDay[dayNum].pmOut ||= timeStr;
      }
    }
  });

  return { empName, period, logsByDay };
}
