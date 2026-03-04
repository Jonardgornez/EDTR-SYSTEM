import { stripAMPM } from "../utils/pdfParser";

const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function DTRForm({ empName, period, logsByDay, edits, onEdit }) {
  const getCellValue = (day, field) => {
    const key = `${day}-${field}`;
    // if user edited, use edited value, else use pdf value stripped
    if (edits[key] != null) return edits[key];
    return stripAMPM(logsByDay?.[day]?.[field] || "");
  };

  return (
    <div className="dtr">
      <h5 style={{ textAlign: "left", fontSize: 7 }}>
        Civil Service Form No. 48
      </h5>
      <h2 style={{ textAlign: "center", fontSize: 11 }}>DAILY TIME RECORD</h2>

      <h4
        style={{
          textAlign: "center",
          fontSize: 15,
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        {empName}
      </h4>

      <h4 style={{ textAlign: "center", fontSize: 7 }}>Name</h4>

      <h4 style={{ textAlign: "left", fontSize: 11 }}>
        For the month of{" "}
        <span style={{ textDecoration: "underline", fontSize: 15 }}>
          {period}
        </span>
      </h4>

      <p style={{ textAlign: "left", fontSize: 10 }}>
        Official hours for arrival (Regular days) <br />
        and departure (Saturdays & Sundays)
      </p>

      <table style={{ marginTop: -15 }}>
        <thead>
          <tr>
            <th rowSpan="2">DAY</th>
            <th colSpan="2">A.M.</th>
            <th colSpan="2">P.M.</th>
            <th colSpan="2">UNDERTIME</th>
          </tr>
          <tr>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Hours</th>
            <th>Mins</th>
          </tr>
        </thead>

        <tbody>
          {days.map((d) => (
            <tr key={d}>
              <td>{d}</td>

              {["amIn", "amOut", "pmIn", "pmOut"].map((field) => (
                <td
                  key={field}
                  contentEditable
                  suppressContentEditableWarning
                  className={field}
                  onInput={(e) =>
                    onEdit(d, field, e.currentTarget.innerText.trim())
                  }
                >
                  {getCellValue(d, field)}
                </td>
              ))}

              <td className="remarks" />
              <td />
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ textAlign: "left", fontWeight: "bold", fontSize: 13 }}>
        Total: _____________________________________
      </p>

      <div className="footer">
        <p>
          I certify on my honor that the above is a true and correct report of
          the hours of work performed, record of which was made during the time
          of arrival at and departure from office.
        </p>
      </div>

      <div className="signature">
        <span>{empName}</span>
        <div>Verified as to the prescribed office hours.</div>
        <div style={{ marginTop: 20 }}>
          <span>In-Charge</span>
        </div>
      </div>
    </div>
  );
}
