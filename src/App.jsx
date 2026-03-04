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
  const [logsByDay, setLogsByDay] = useState({});
  const [edits, setEdits] = useState({}); // shared edits across all copies

  const dtrCopies = useMemo(() => [1, 2, 3, 4], []);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setPercent(0);

    try {
      const result = await parseDTRPdf(file, (p) => setPercent(p));
      setEmpName(result.empName);
      setPeriod(result.period);
      setLogsByDay(result.logsByDay);
      setEdits({}); // reset edits on new upload
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (day, field, value) => {
    const key = `${day}-${field}`;
    setEdits((prev) => ({ ...prev, [key]: value }));
  };

  const onPrint = () => window.print();

  return (
    <div>
      <UploadBox onFile={handleFile} onPrint={onPrint} />

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

      <ProgressModal show={loading} percent={percent} />
    </div>
  );
}
