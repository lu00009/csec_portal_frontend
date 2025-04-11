// components/profile/requiredinfo.tsx
interface RequiredInfoProps {
  member: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    department: string;
    graduation: string;
    birth: string;
    gender: string;
    telegramUsername: string;
    joinedDate: string;
  };
}

const RequiredInfo = ({ member }: RequiredInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Left Column */}
      <div className="space-y-8 bg-white rounded-lg p-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">First Name</label>
          <p className="font-medium">{member.firstName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Last Name</label>
          <p className="font-medium">{member.lastName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Mobile Number</label>
          <div className="flex items-center">
            <p className="font-medium">{member.phoneNumber}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email Address</label>
          <div className="flex items-center">
            <p className="font-medium">{member.email}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Department</label>
          <p className="font-medium">{member.department}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Expected Graduation Year</label>
          <p className="font-medium">{member.graduation}</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="bg-white rounded-lg p-6 space-y-8">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
          <div className="flex items-center">
            <p className="font-medium">{member.birth}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Gender</label>
          <div className="flex items-center">
            <p className="font-medium">{member.gender}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Telegram Handle</label>
          <div className="flex items-center">
            <p className="font-medium">{member.telegramUsername}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Joined Date</label>
          <div className="flex items-center">
            <p className="font-medium">{formatDate(member.joinedDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredInfo;