const StatusBadge = ({ status }) => {
  const statusStyles = {
    Saved: 'bg-gray-100 text-gray-800',
    Applied: 'bg-blue-100 text-blue-800',
    Assessment: 'bg-purple-100 text-purple-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
    Selected: 'bg-green-100 text-green-800',
  };

  const style = statusStyles[status] || statusStyles.Saved;

  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;