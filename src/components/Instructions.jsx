const instructionCopies = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

const instructionHtml = `
Civil Service Form 48, after completion, should be filed in the
records of the Bureau or Office which submits the monthly report on
Civil Service Form No.3 to the Bureau of Civil Service. <br /><br />

In lieu of the above, court interpreters and stenographers who
accompany the judges of the Court of First Instance will fill out
the daily time reports on this form in triplicate, after which they
should be approved by the judge with whom service has been rendered,
or by an officer of the Department of Justice authorized to do so.
The original should be forwarded promptly after the end of the month
to the Bureau of Civil Service, thru the Department of Justice; the
duplicate to be kept in the Department of Justice; and the
triplicate, in the office of the Clerk of Court where service was
rendered <br /><br />

In the space provided for the purpose on the other side will be
indicated the office hours the employee is required to observe, as
far example, "Regulardays, 8:00 - 12:00 and 1-4; Saturdays, 8:00 -
1:00/" <br /><br />

Each chief of a Bureau or Office shall require a daily record of
attendance of all the officers and employees under him entitled to
leave of absence or vacation (including teachers) to be kept on the
proper form and also a systematic office record showing for each day
all absences from duty from any cause whatever. At the beginning of
each month he shall report to the Commissioner on the proper form of
all absence from any cause whatever,including the exact amount of
undertime of each person for each day. Officers or employees serving
i the filed or on the water need not be required to keep a daily
record, but all absences of such employees muyst be included tn the
monthly report of changes and absences. Falsification of time
records will render the offending officer or employee lible to
summary removal from the service and criminal prosecution."
<br /><br />
<br /><br />
<br /><br />
<br /><br />
<br /><br />
<br /><br />
<br /><br />
<br /><br />
<br /><br />
(Note A record made from memory or sometime subsequent to the
occurrence of an event is not reliable. Non- observance of office
hours deprives the employee of the leave privilegies althou he may
have rendered overtime service. Where service rendered outside of
the Office for the whole morning or afternoon notation to that
office should be made clearly.).
`;

export default function Instructions() {
  return (
    <div className="instructions">
      <div className="page">
        {instructionCopies.map((c) => (
          <div className="instr-copy" key={c.id}>
            <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
              INSTRUCTIONS
            </h4>

            <p
              style={{ fontSize: 12, textAlign: "justify" }}
              dangerouslySetInnerHTML={{ __html: instructionHtml }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
