import { FiSmartphone, FiMail, FiCalendar, FiUser, FiGithub, FiSend } from 'react-icons/fi';
import member1Data from '../../app/data/memberdata';

const RequiredInfo = () => {

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* Left Column */}
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">First Name</label>
            <p className="font-medium">{member1Data.requiredInfo.firstName}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Last Name</label>
            <p className="font-medium">{member1Data.requiredInfo.lastName}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Mobile Number</label>
            <div className="flex items-center">
              <FiSmartphone className="text-gray-400 mr-2" />
              <p className="font-medium">{member1Data.requiredInfo.phone}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email Address</label>
            <div className="flex items-center">
              <FiMail className="text-gray-400 mr-2" />
              <p className="font-medium">{member1Data.requiredInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Academic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Department</label>
            <p className="font-medium">{member1Data.requiredInfo.department}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Expected Graduation Year</label>
            <p className="font-medium">{member1Data.requiredInfo.graduation}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Specialization</label>
            <p className="font-medium">{member1Data.requiredInfo.specialization}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">CGPA</label>
            <p className="font-medium">{member1Data.requiredInfo.cgpa}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
            <div className="flex items-center">
              <FiCalendar className="text-gray-400 mr-2" />
              <p className="font-medium">{member1Data.requiredInfo.birth}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Gender</label>
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-2" />
              <p className="font-medium">{member1Data.requiredInfo.gender}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Social Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Github</label>
            <div className="flex items-center">
              <FiGithub className="text-gray-400 mr-2" />
              <a href={member1Data.requiredInfo.github} className="font-medium text-blue-600 hover:underline">
                {member1Data.requiredInfo.github}
              </a>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Telegram Handle</label>
            <div className="flex items-center">
              <FiSend className="text-gray-400 mr-2" />
              <p className="font-medium">{member1Data.requiredInfo.telegram}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-800 mb-4">Mentor</h3>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <span className="text-lg font-bold text-purple-600">K</span>
          </div>
          <div>
            <p className="font-medium">{member1Data.requiredInfo.mentor}</p>
            <p className="text-sm text-gray-500">Senior Developer</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default RequiredInfo