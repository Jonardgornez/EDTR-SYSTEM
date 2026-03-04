// src/App.jsx
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

  // null = no file uploaded yet
  const [logsByDay, setLogsByDay] = useState(null);

  // shared edits for all copies
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

  const handlePrint = async () => {
    if (!hasData) return;

    if (!window.EDTR?.openChrome) {
      alert("EDTR bridge missing. Preload not loaded.");
      return;
    }

    await window.EDTR.openChrome(window.location.href);
  };

  return (
    <div>
      <UploadBox onFile={handleFile} onPrint={handlePrint} canPrint={hasData} />

      {/* Show DTR only after upload */}
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
