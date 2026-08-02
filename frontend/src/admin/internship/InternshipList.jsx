import InternshipCard from "./InternshipCard";

const InternshipList = ({ internships, refreshInternships }) => {
  return (
    <div className="space-y-4">
      {internships.map((intern) => (
        <InternshipCard key={intern._id} intern={intern} refreshInternships={refreshInternships} />
      ))}
    </div>
  );
};

export default InternshipList;