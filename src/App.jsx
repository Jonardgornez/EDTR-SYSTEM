import { useMemo, useState } from "react";
import UploadBox from "./components/UploadBox";
import ProgressModal from "./components/ProgressModal";
import DTRForm from "./components/DTRForm";
import Instructions from "./components/Instructions";
import { parseDTRPdf } from "./utils/pdfParser";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const [empName, setEmpName] = useState("_____________________");
  const [period, setPeriod] = useState("For the month of _____________");

  const [logsByDay, setLogsByDay] = useState(null);
  const [edits, setEdits] = useState({});

  const dtrCopies = useMemo(() => [1, 2, 3, 4], []);
  const hasData = !!logsByDay;

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setPercent(0);

    try {
      const result = await parseDTRPdf(file, (p) => setPercent(p));
      setEmpName(result.empName);
      setPeriod(result.period);
      setLogsByDay(result.logsByDay);
      setEdits({});
    } catch (err) {
      console.error("PDF parsing error:", err);
      setLogsByDay(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (day, field, value) => {
    const key = `${day}-${field}`;
    setEdits((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ Best: build HTML + open in Chrome + auto print preview
  const handlePrint = async () => {
    if (!hasData) return;

    const formsHtml =
      document.getElementById("formsContainer")?.outerHTML || "";
    const instructionsHtml =
      document.querySelector(".instructions")?.outerHTML || "";

    // Collect CSS rules from loaded stylesheets (your local CSS is OK)
    const css = Array.from(document.styleSheets)
      .map((s) => {
        try {
          return Array.from(s.cssRules)
            .map((r) => r.cssText)
            .join("\n");
        } catch {
          return "";
        }
      })
      .join("\n");

    const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DTR Print</title>
  <style>${css}</style>
</head>
<body>
  ${formsHtml}
  ${instructionsHtml}

  <script>
    window.onload = () => setTimeout(() => window.print(), 300);
  </script>
</body>
</html>`;

    // Electron → Chrome
    if (window.EDTR?.printInChrome) {
      await window.EDTR.printInChrome(htmlDoc);
      return;
    }

    // Web fallback: open a new tab and print
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(htmlDoc);
    w.document.close();
  };

  return (
    <div>
      <UploadBox onFile={handleFile} onPrint={handlePrint} canPrint={hasData} />

      {hasData && (
        <>
          <div className="page" id="formsContainer">
            {dtrCopies.map((copyId) => (
              <DTRForm
                key={copyId}
                empName={empName}
                period={period}
                logsByDay={logsByDay}
                edits={edits}
                onEdit={handleEdit}
              />
            ))}
          </div>

          <Instructions />

          <div className="powered">
            Developed By: <b>TeradaPasagad</b>
          </div>
        </>
      )}

      <ProgressModal show={loading} percent={percent} />
    </div>
  );
}
