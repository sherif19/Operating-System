import { useLocation } from 'react-router-dom';
import { DepartmentDashboard } from './DepartmentDashboard';
import { DepartmentOperations } from './DepartmentOperations';
import { DepartmentTeam } from './DepartmentTeam';
import { DepartmentTasks } from './DepartmentTasks';
import { DepartmentCalendar } from './DepartmentCalendar';
import { DepartmentCollaboration } from './DepartmentCollaboration';
import { DepartmentAnalytics } from './DepartmentAnalytics';
import { DepartmentAICoach } from './DepartmentAICoach';

export function DepartmentOSHub() {
  const location = useLocation();
  const path = location.pathname;

  // Helper renderer based on pathname if child outlet is not rendered
  const renderTabContent = () => {
    if (path.endsWith('/operations')) return <DepartmentOperations />;
    if (path.endsWith('/team')) return <DepartmentTeam />;
    if (path.endsWith('/tasks')) return <DepartmentTasks />;
    if (path.endsWith('/calendar')) return <DepartmentCalendar />;
    if (path.endsWith('/collaboration')) return <DepartmentCollaboration />;
    if (path.endsWith('/analytics') || path.endsWith('/reports')) return <DepartmentAnalytics />;
    if (path.endsWith('/ai-coach')) return <DepartmentAICoach />;
    return <DepartmentDashboard />;
  };

  return (
    <div className="w-full text-right">
      {renderTabContent()}
    </div>
  );
}

export default DepartmentOSHub;
