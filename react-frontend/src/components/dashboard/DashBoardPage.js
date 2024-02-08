import React from "react";
import "./DashBoardPage.css";
import JobSummary from "../job_summary/JobSummary";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

const DashBoardPage = () => {
  const jobs = [
      { id: 1, title: "Software Engineer", hirer: "Tech Inc.", description: "Develop full-stack applications.", location: "New York" },
      { id: 2, title: "Product Manager", hirer: "Innovate LLC", description: "Lead product development teams.", location: "Remote" },
      {
        id: 3,
        title: "Senior Data Analyst",
        hirer: "DataWorks Solutions",
        description: `We are looking for a Senior Data Analyst who will turn data into information, information into insight and insight into business decisions. Responsibilities include conducting full lifecycle analysis to include requirements, activities and design. Data analysts will develop analysis and reporting capabilities. They will also monitor performance and quality control plans to identify improvements.

Responsibilities:
- Interpret data, analyze results using statistical techniques and provide ongoing reports.
- Develop and implement databases, data collection systems, data analytics and other strategies that optimize statistical efficiency and quality.
- Acquire data from primary or secondary data sources and maintain databases/data systems.
- Identify, analyze, and interpret trends or patterns in complex data sets.
- Filter and “clean” data by reviewing computer reports, printouts, and performance indicators to locate and correct code problems.
- Work with management to prioritize business and information needs.
- Locate and define new process improvement opportunities.`,
        location: "San Francisco, CA"
      },
      {
        id: 4,
        title: "UI/UX Designer",
        hirer: "Creative Design Studio",
        description: "Seeking a creative UI/UX Designer to design and shape unique, user-centric products and experiences. The ideal candidate will have experience working in agile teams, with developers, UX designers, and copywriters. You will be able to make deliberate design decisions and to translate any given user-experience journey into a smooth and intuitive interaction.",
      },
  ];

  return (
    <div className="dashboard-page">
      <h2>Dashboard Page</h2>
      <p>Jobs tailored for you!</p>
      {jobs.map(job => (
          <JobSummary 
              key={job.id} 
              id={job.id} 
              title={job.title} 
              hirer={job.hirer} 
              description={job.description} 
              location={job.location} 
          />
      ))}
    </div>
  );
};

export default DashBoardPage;