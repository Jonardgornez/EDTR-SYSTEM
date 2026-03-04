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

  // ✅ null = no upload yet (so nothing shows)
  const [logsByDay, setLogsByDay] = useState(null);

  // Shared edits across all copies
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
      console.error(err);
      // reset if something fails
      setLogsByDay(null);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (day, field, value) => {
    const key = `${day}-${field}`;
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  const onPrint = () => {
    if (!hasData) return; // ✅ do nothing if no upload
    window.print();
  };

  return (
    <div>
      <UploadBox onFile={handleFile} onPrint={onPrint} canPrint={hasData} />

      {/* ✅ Only show forms after PDF is uploaded and parsed */}
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
                onEdit={onEdit}
              />
            ))}
          </div>

          <Instructions copies={4} />

          <div className="powered">
            Developed By: <b>TeradaPasagad</b>
          </div>
        </>
      )}

      <ProgressModal show={loading} percent={percent} />
    </div>
  );
}
