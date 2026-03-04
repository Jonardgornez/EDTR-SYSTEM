const instructionBlocks = [
  {
    title: "INSTRUCTIONS",
    text: `Civil Service Form 48, after completion, should be filed in the records of the Bureau or Office which submits the monthly report on Civil Service Form No.3 to the Bureau of Civil Service.

In lieu of the above, court interpreters and stenographers who accompany the judges of the Court of First Instance will fill out the daily time reports on this form in triplicate, after which they should be approved by the judge with whom service has been rendered, or by an officer of the Department of Justice authorized to do so. The original should be forwarded promptly after the end of the month to the Bureau of Civil Service, thru the Department of Justice; the duplicate to be kept in the Department of Justice; and the triplicate, in the office of the Clerk of Court where service was rendered

In the space provided for the purpose on the other side will be indicated the office hours the employee is required to observe, as for example, "Regular days, 8:00 - 12:00 and 1-4; Saturdays, 8:00 - 1:00/"

Each chief of a Bureau or Office shall require a daily record of attendance... (same text)

(Note: A record made from memory... should be made clearly.).`,
  },
];

export default function Instructions({ copies = 4 }) {
  const copiesArr = Array.from({ length: copies }, (_, i) => i + 1);

  return (
    <div className="instructions">
      <div className="page">
        {copiesArr.map((n) =>
          instructionBlocks.map((block, idx) => (
            <div className="instr-copy" key={`${n}-${idx}`}>
              <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
                {block.title}
              </h4>
              <p
                style={{
                  fontSize: 12,
                  textAlign: "justify",
                  whiteSpace: "pre-wrap",
                }}
              >
                {block.text}
              </p>
            </div>
          )),
        )}
      </div>
    </div>
  );
}
