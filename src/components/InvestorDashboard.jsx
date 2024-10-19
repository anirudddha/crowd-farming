import React, { useEffect, useState } from 'react';

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch investment data
    const fetchedInvestments = [
      { id: 1, campaign: 'Green Valley Farm', amount: 500, progress: '50%' },
      { id: 2, campaign: 'Sunny Meadows', amount: 1000, progress: '30%' },
    ];

    setInvestments(fetchedInvestments);
    calculateTotalInvestment(fetchedInvestments);
  }, []);

  const calculateTotalInvestment = (data) => {
    const total = data.reduce((acc, investment) => acc + investment.amount, 0);
    setTotalInvested(total);
  };

  return (
    <div>
      <h2>Investor Dashboard</h2>
      <p>Total Invested: ${totalInvested}</p>

      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Invested Amount</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <tr key={investment.id}>
              <td>{investment.campaign}</td>
              <td>${investment.amount}</td>
              <td>{investment.progress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvestorDashboard;
