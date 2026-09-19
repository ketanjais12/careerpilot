import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application }) => {
  const date = new Date(application.applicationDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{application.jobTitle}</h3>
          <p className="text-gray-600 font-medium">{application.company}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>Applied: {date}</p>
        {application.location && <p>Location: {application.location}</p>}
      </div>

      <div className="flex justify-end">
        <Link 
          to={`/applications/${application._id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ApplicationCard;