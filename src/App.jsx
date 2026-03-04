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

  const handlePrint = () => {
    if (!hasData) return;
    window.print();
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
