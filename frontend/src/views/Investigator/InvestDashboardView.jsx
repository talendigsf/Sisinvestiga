import React from 'react'
import NavInvestigator from '../../components/Investigator/Common/NavInvestigator';
import DashboardContent from '../../components/Investigator/DashboardManagement/DashboardContent';
import ErrorBoundary from '../../components/Common/ErrorBoundary'

const InvestDashboardView = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavInvestigator />
      <main className="flex-grow">
        <ErrorBoundary>
          <DashboardContent />
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default InvestDashboardView